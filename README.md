# Collections

- id
- name
- user_id

# Collection Items

- id
- name
- is_done
- user_id

- Bisa ditambahkan ke today activity
- Bisa ditoggle done (otomatis mengubah is_done activity)
- Jika sudah ditambahkan ke today activity maka tidak bisa ditambahkan lagi
- Jika kemarin sudah ditambahkan ke activity dan belum selesai, maka bisa ditambahkan ke today activity (Activity yang kemarin jadi dismissed)

# Activities

- id
- name
- is_done
- is_dismissed
- due_at
- user_id
- collection_item_id

- Bisa ditoggle done (otomatis mengubah is_done collection item)
- Hanya today activity yang bisa di toggle is_done
- Jika ada activity kemarin yang (tidak selesai, tidak diperpanjang, tidak didismiss) maka muncul alert
- Activity kemarin yang tidak selesai bisa (ditandai sebagai selesai dan diperpanjang ke hari ini) selama masih dalam rentang kemarin, belum diperpanjang, belum didismiss, dan belum ditandai sebagai selesai.
