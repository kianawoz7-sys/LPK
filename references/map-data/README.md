# Data peta Jepang

`japan-natural-earth.geojson` adalah satu feature dengan `ADM0_A3: JPN` yang diekstrak pada 13 Oktober 2026 dari [Natural Earth 1:50m Admin 0 Countries](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson), melalui file raw pada repository pembuat dataset.

Natural Earth menyatakan seluruh data raster/vector dalam [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Geometry asli disimpan agar aset dapat diregenerasi tanpa jaringan. `node scripts/generate-japan-map.mjs` mengubah seluruh polygon Jepang ke proyeksi Mercator, arah utara di atas, dan menghasilkan `public/images/japan-map.svg`. Tidak ada garis rute, cabang, mitra, atau lokasi penempatan J.A.T yang ditambahkan.

Peta dipasang di Tentang Kami atas permintaan eksplisit pemilik proyek, menggantikan larangan peta tanpa persetujuan pada PRD lama. Ini visual geografis Jepang; profil kelembagaan yang tidak tersedia tidak dikarang.
