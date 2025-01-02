// const requiredFields = [
//     "product_name",
//     "brand_name",
//     "price",
//     "cashback",
//     "category",
//     "product_status",
//     "banner_status",
//     "terms",
//     "tags",
//     "meta_title",
//     "meta_description",
//     "meta_keywords",
//     "tags",
//   ];

//   for (const field of requiredFields) {
//     if (!form_data[field as keyof typeof form_data]) {
//       toast.error(`${field.replace("_", " ")} is required.`);
//       return;
//     }
//   }

//   if (!editorContent.trim()) {
//     toast.error("Description is required.");
//     return;
//   }

//   if (form_data.images == null) {
//     toast.error("Please select at least Three image.");
//     return;
//   }

//   const formPayload = new FormData();
//   if (form_data.images && isFileList(form_data.images)) {
//     Array.from(form_data.images).forEach((file) =>
//       formPayload.append("images", file)
//     );
//   } else if (form_data.images !== null) {
//     toast.error("Invalid file input.");
//     return;
//   }

//   Object.entries(form_data).forEach(([key, value]) => {
//     if (key !== "images" && value !== undefined && value !== null) {
//       formPayload.append(key, String(value));
//     }
//   });
//   formPayload.append("description", editorContent);
//   const slug_url = generateSlug(form_data.slug_url_name);
//   formPayload.append("slug_url", slug_url);

//   setLoading(true);

//   const { data } = await axios.post(add_product, formPayload, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   // console.log("data==>", data);
// // 