# Hướng Dẫn Fix Lỗi Kết Nối MongoDB (DNS Error)

Nếu bạn gặp lỗi `querySrv ECONNREFUSED` hoặc app bị crash không kết nối được DB, nguyên nhân thường là do **DNS nhà mạng (Viettel/VNPT) chặn hoặc lỗi** khi resolve tên miền MongoDB (SRV records).

Dưới đây là cách khắc phục triệt để.

## 1. Nguyên lý

Thay vì dùng Connection String ngắn gọn (`mongodb+srv://...`) phụ thuộc vào DNS, ta sẽ dùng **Connection String đầy đủ** (`mongodb://...`) liên kết trực tiếp tới các server con (shards).

## 2. Cách lấy địa chỉ Server con (Shards)

Vì DNS máy bạn bị lỗi nên không thể ping hay nslookup ra địa chỉ server. Ta dùng script sau để **hỏi Google DNS** (bypass local DNS):

1. Tạo file `resolve_dns.js` trong thư mục backend.
2. Dán nội dung sau:

```javascript
/* resolve_dns.js */
import https from 'https';

// --- CẤU HÌNH ---
// Lấy phần domain từ connection string cũ của bạn
// Ví dụ: mongodb+srv://user:pass@cluster0.1ksko0k.mongodb.net/...
const srvDomain = '_mongodb._tcp.cluster0.1ksko0k.mongodb.net'; 
// ----------------

const url = `https://dns.google/resolve?name=${srvDomain}&type=SRV`;

console.log(`Đang truy vấn Google DNS: ${url}...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.Answer) {
                console.log('\n✅ TÌM THẤY CÁC SERVER:');
                json.Answer.forEach(ans => {
                    // Cấu trúc data: "priority weight port target"
                    const target = ans.data.split(' ')[3]; 
                    console.log(`- ${target}`); 
                });
                console.log('\n-> Hãy copy các địa chỉ trên để dùng ở Bước 3.');
            } else {
                console.log('❌ Không tìm thấy! Kiểm tra lại tên domain.');
            }
        } catch (e) {
            console.error('Lỗi parse JSON:', e);
        }
    });
});
```

3. Chạy lệnh: `node resolve_dns.js`
4. Copy danh sách server trả về (ví dụ: `ac-mbdgj3q-shard-00-00.1ksko0k.mongodb.net`).

## 3. Tạo Connection String mới

Công thức chuẩn:
```
mongodb://<USER>:<PASS>@<HOST1>:27017,<HOST2>:27017,<HOST3>:27017/<DB_NAME>?ssl=true&authSource=admin&retryWrites=true&w=majority
```

**Ví dụ áp dụng:**
- **User**: `hoduckhuy_db_user`
- **Pass**: `I212fdNKlZo2JTLI`
- **Hosts**: Lấy từ bước 2 (nhớ thêm `:27017` sau mỗi host)
  - `ac-mbdgj3q-shard-00-00.1ksko0k.mongodb.net:27017`
  - `ac-mbdgj3q-shard-00-01.1ksko0k.mongodb.net:27017`
  - `ac-mbdgj3q-shard-00-02.1ksko0k.mongodb.net:27017`
- **DB Name**: `quickchat`

-> **Chuỗi kết nối cuối cùng:**
```
mongodb://hoduckhuy_db_user:I212fdNKlZo2JTLI@ac-mbdgj3q-shard-00-00.1ksko0k.mongodb.net:27017,ac-mbdgj3q-shard-00-01.1ksko0k.mongodb.net:27017,ac-mbdgj3q-shard-00-02.1ksko0k.mongodb.net:27017/quickchat?ssl=true&authSource=admin&retryWrites=true&w=majority
```

## 4. Áp dụng

Dán chuỗi trên vào file `.env`:
```env
MONGODB_CONNECTIONSTRING=mongodb://... (chuỗi dài ở trên) ...
```

Lưu lại và restart server. Done! 🚀
