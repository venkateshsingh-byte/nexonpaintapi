const ColorProductBucket = require('../model/colorproductbucket');
const Product = require('../model/product');
const Category= require('../model/category')


exports.getColorProductBucket = async (req, res) => {
  try {
    const data = await ColorProductBucket.find()
    .populate({
      path: 'buckets.product',
      populate: [
        { path: 'category' },
        { path: 'subcategory' },
        { path: 'typeofproduct' }
      ]
    });

    res.json({ response: 'success', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: 'error', message: err.message });
  }
};


exports.getColorProductBucketById = async (req, res) => {
  try {
    const data = await ColorProductBucket.findById(req.params.id).populate('buckets.product');
    if (!data) return res.status(404).json({ response: 'error', message: 'Not found' });
    res.json({ response: 'success', data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: 'error', message: err.message });
  }
};


exports.addColorProductBucket = async (req, res) => {
  try {
    // 1) Normalize buckets from multipart/form-data:
    let buckets = req.body?.buckets || [];
    if (!Array.isArray(buckets) && buckets && typeof buckets === 'object') {
      const keys = Object.keys(buckets).sort((a, b) => Number(a) - Number(b));
      buckets = keys.map(k => buckets[k]);
    }
    if (!Array.isArray(buckets)) buckets = [];

    // 2) Attach uploaded filenames from multer to the right bucket slot
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const m = file.fieldname.match(/buckets\[(\d+)\]\[(.+)\]/);
        if (m) {
          const idx = Number(m[1]);
          const key = m[2]; // "product_img" | "product_small_img"
          if (!buckets[idx]) buckets[idx] = {};
          buckets[idx][key] = file.filename;
        }
      });
    }

    // ---------- NEW: uniqueness checks for product_bucket_title ----------
    // A) Block duplicates inside the incoming payload (case-insensitive)
    const seen = new Set();
    for (let i = 0; i < buckets.length; i++) {
      const t = (buckets[i]?.product_bucket_title || "").trim().toLowerCase();
      if (!t) continue;
      if (seen.has(t)) {
        return res.status(400).json({
          response: "error",
          message: `Duplicate product_bucket_title in request: "${buckets[i].product_bucket_title}" (row #${i + 1})`,
        });
      }
      seen.add(t);
    }

    // B) (OPTIONAL) Block duplicates that already exist in DB (global uniqueness)
    //     If you only want uniqueness within a single ColorProductBucket doc, remove this block.
    const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (let i = 0; i < buckets.length; i++) {
      const title = (buckets[i]?.product_bucket_title || "").trim();
      if (!title) continue;

      const exists = await ColorProductBucket.exists({
        "buckets.product_bucket_title": { $regex: `^${escapeRx(title)}$`, $options: "i" },
      });

      if (exists) {
        return res.status(409).json({
          response: "error",
          message: `product_bucket_title already exists: "${title}"`,
        });
      }
    }
    // ---------- END uniqueness checks ----------

    // 3) Resolve product by product_bucket_title (your logic)
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i];

      if (!bucket?.product_bucket_title) {
        return res.status(400).json({
          response: "error",
          message: `Bucket #${i + 1} is missing product_bucket_title`,
        });
      }

      const product = await Product.findOne({ product_name: bucket.product_bucket_title });
      if (!product) {
        return res
          .status(400)
          .json({ response: "error", message: `Product not found for title ${bucket.product_bucket_title}` });
      }

      // product_img required by your schema
      if (!bucket.product_img) {
        return res
          .status(400)
          .json({ response: "error", message: `Bucket #${i + 1} is missing product_img` });
      }

      bucket.product = product._id;
    }

    // 4) Create document
    const newBucket = await ColorProductBucket.create({ buckets });
    res.json({ response: "success", data: newBucket });
  } catch (err) {
    res.status(500).json({ response: "error", message: err.message });
  }
};



// EDIT
exports.editColorProductBucket = async (req, res) => {
  try {
    // Normalize incoming buckets (multer + qs can produce object-of-indexes)
    let incoming = req.body?.buckets || [];
    if (!Array.isArray(incoming) && incoming && typeof incoming === 'object') {
      const keys = Object.keys(incoming).sort((a, b) => Number(a) - Number(b));
      incoming = keys.map(k => incoming[k]);
    }

    // Attach uploaded filenames to the corresponding bucket fields
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/buckets\[(\d+)\]\[(.+)\]/);
        if (match) {
          const index = Number(match[1]);
          const key = match[2];
          if (!incoming[index]) incoming[index] = {};
          incoming[index][key] = file.filename; // e.g., product_img/product_small_img
        }
      });
    }

    // Load existing doc to merge (so old images aren’t lost)
    const existing = await ColorProductBucket.findById(req.params.id).lean();
    if (!existing) {
      return res.status(404).json({ response: 'error', message: 'Not found' });
    }

    // Resolve product for each bucket, and merge with existing if missing fields
    const nextBuckets = [];
    for (let i = 0; i < incoming.length; i++) {
      const inc = incoming[i] || {};
      const prev = existing.buckets?.[i] || {};

      // Ensure a title exists after merge (we also validate duplicates below)
      const mergedTitle = (inc.product_bucket_title ?? prev.product_bucket_title ?? "").trim();
      if (!mergedTitle) {
        return res.status(400).json({
          response: "error",
          message: `Bucket #${i + 1} is missing product_bucket_title`
        });
      }

      // Resolve product:
      let productId = prev.product;
      if (inc.product && mongoose.Types.ObjectId.isValid(inc.product)) {
        productId = inc.product;
      } else if (inc.product_bucket_title) {
        const product = await Product.findOne({ product_name: inc.product_bucket_title }).lean();
        if (!product) {
          return res.status(400).json({
            response: "error",
            message: `Product not found for title ${inc.product_bucket_title}`
          });
        }
        productId = product._id;
      }

      nextBuckets.push({
        product_bucket_title: mergedTitle,
        product_img: inc.product_img ?? prev.product_img ?? null,
        product_small_img: inc.product_small_img ?? prev.product_small_img ?? null,
        product: productId
      });
    }

    // ---------- UNIQUENESS: inside this document (case-insensitive) ----------
    const seen = new Set();
    for (let i = 0; i < nextBuckets.length; i++) {
      const t = nextBuckets[i].product_bucket_title.trim().toLowerCase();
      if (seen.has(t)) {
        return res.status(400).json({
          response: "error",
          message: `Duplicate product_bucket_title in this document: "${nextBuckets[i].product_bucket_title}" (row #${i + 1})`,
        });
      }
      seen.add(t);
    }

    // ---------- OPTIONAL: global uniqueness across other docs ----------
    // Remove this block if you only care about uniqueness within this one document.
    const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (let i = 0; i < nextBuckets.length; i++) {
      const title = nextBuckets[i].product_bucket_title.trim();
      const existsElsewhere = await ColorProductBucket.exists({
        _id: { $ne: req.params.id },
        "buckets.product_bucket_title": { $regex: `^${escapeRx(title)}$`, $options: "i" },
      });
      if (existsElsewhere) {
        return res.status(409).json({
          response: "error",
          message: `product_bucket_title already exists in another document: "${title}"`,
        });
      }
    }
    // ------------------------------------------------------------------

    const updatedBucket = await ColorProductBucket.findByIdAndUpdate(
      req.params.id,
      { buckets: nextBuckets },
      { new: true }
    );

    if (!updatedBucket) {
      return res.status(404).json({ response: 'error', message: 'Not found' });
    }

    res.json({ response: 'success', data: updatedBucket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: 'error', message: err.message });
  }
};




// DELETE
exports.deleteColorProductBucket = async (req, res) => {
  try {
    const deleted = await ColorProductBucket.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ response: 'error', message: 'Not found' });
    res.json({ response: 'success', message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: 'error', message: err.message });
  }
};


// Catgory Name by get Color Bucket (Fixed)
exports.getBucketsByCategoryName = async (req, res) => {
  try {
    const { name } = req.params;

    // Find category by slug or URL-friendly name (case-insensitive)
    const category = await Category.findOne({
      cat_url: { $regex: `^${name}$`, $options: "i" },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Fetch all color product buckets
    const allBuckets = await ColorProductBucket.find().populate({
      path: "buckets.product",
      populate: ["category", "subcategory", "typeofproduct"],
    });

    // Filter buckets where product.category matches the found category
    const filteredBuckets = allBuckets
      .map((bucketDoc) => {
        const matchingBuckets = bucketDoc.buckets.filter(
          (b) =>
            b.product.category &&
            b.product.category._id.toString() === category._id.toString()
        );
        return matchingBuckets.length > 0
          ? { _id: bucketDoc._id, buckets: matchingBuckets }
          : null;
      })
      .filter(Boolean);

    // Map response
    const responseData = filteredBuckets.map((bucketDoc) => ({
      _id: bucketDoc._id,
      buckets: bucketDoc.buckets.map((b) => ({
        product_small_img: b.product_small_img,
        product_img: b.product_img,
        product_bucket_title: b.product_bucket_title,
        product: {
          _id: b.product._id,
          product_name: b.product.product_name,
          product_subname: b.product.product_subname,
          product_desc: b.product.product_desc,
          technical_datasheet: b.product.technical_datasheet,
          warranty_document: b.product.warranty_document,
          benefit: b.product.benefit,
          green_pro_certificate: b.product.green_pro_certificate,
          application_process: b.product.application_process,
          meta_title: b.product.meta_title,
          meta_desc: b.product.meta_desc,
          slug: b.product.slug,
          typeofproduct: b.product.typeofproduct
            ? {
                _id: b.product.typeofproduct._id,
                typeofproduct_name: b.product.typeofproduct.typeofproduct_name,
              }
            : null,
        },
      })),
    }));

    res.status(200).json({
      success: true,
      category: {
        cat_name: category.cat_name,
        cat_subname:category.cat_subname,   
        meta_title: category.meta_title,
        meta_desc: category.meta_desc,
        cat_url: category.cat_url,
      },
      data: responseData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};