
let mocBatDau = 0;
let tongThoiGian = 0;
let mocDung = 0;
let tongThoiGianDung = 0;
let trangThai = "nghi";
let dongHo = null;
let lichSu = [];
let dangMoLichSu = false;

function luuDuLIieu() {
    localStorage.setItem("mayChayData", JSON.stringify({
        mocBatDau,
        tongThoiGian,
        mocDung,
        tongThoiGianDung,
        trangThai,
        lichSu
    }));
}

function ketThucCa() {
    if (trangThai === "nghi") {
        alert("Ca hiện tại đã kết thúc hoặc chưa bắt đầu!");
        return;
    }

    if (!confirm("Kết thúc ca và lưu lại dữ liệu?")) return;

    let hienTai = Date.now();

    // Chốt thời gian đang chạy hoặc đang dừng
    if (trangThai === "chay") {
        tongThoiGian += hienTai - mocBatDau;
    } else if (trangThai === "dung") {
        tongThoiGianDung += hienTai - mocDung;
    }

    // Đọc lịch sử các ca đã lưu
    let cacCa = [];

    try {
        cacCa = JSON.parse(
            localStorage.getItem("mayChayCacCa")
        ) || [];

        if (!Array.isArray(cacCa)) cacCa = [];
    } catch {
        cacCa = [];
    }

    // Lưu ca vừa kết thúc
    cacCa.push({
        ngayKetThuc: new Date(hienTai).toLocaleString("vi-VN"),
        tongThoiGian: tongThoiGian,
        tongThoiGianDung: tongThoiGianDung,
        lichSu: [...lichSu]
    });

    localStorage.setItem(
        "mayChayCacCa",
        JSON.stringify(cacCa)
    );

    // Reset để chuẩn bị ca mới
    mocBatDau = 0;
    tongThoiGian = 0;
    mocDung = 0;
    tongThoiGianDung = 0;
    trangThai = "nghi";
    lichSu = [];

    luuDuLIieu();
    veLichSu();
    capNhatManHinh();

    alert("Đã kết thúc ca và lưu lịch sử!");
}

function docDuLieu() {
    let duLieu = localStorage.getItem("mayChayData");

    if (duLieu === null) return;

    try {
        let data = JSON.parse(duLieu);

        mocBatDau = data.mocBatDau || 0;
        tongThoiGian = data.tongThoiGian || 0;
        mocDung = data.mocDung || 0;
        tongThoiGianDung = data.tongThoiGianDung || 0;
        trangThai = data.trangThai || "nghi";
        lichSu = data.lichSu || [];
    } catch {
        localStorage.removeItem("mayChayData");
    }
}

function hienThiThoiGian(ms) {
    let giay = Math.floor(ms / 1000);
    let gio = Math.floor(giay / 3600);
    let phut = Math.floor((giay % 3600) / 60);
    let giayLe = giay % 60;

    return String(gio).padStart(2, "0") + ":" +
           String(phut).padStart(2, "0") + ":" +
           String(giayLe).padStart(2, "0");
}

function capNhatManHinh() {
    let hienTai = Date.now();
    let thoiGianChay = tongThoiGian;
    let thoiGianDung = tongThoiGianDung;

    if (trangThai === "chay") {
        thoiGianChay += hienTai - mocBatDau;
    } else if (trangThai === "dung") {
        thoiGianDung += hienTai - mocDung;
    }

    document.getElementById("thoiGian").textContent =
        hienThiThoiGian(thoiGianChay);

    document.getElementById("thoiGianDung").textContent =
        hienThiThoiGian(thoiGianDung);

    capNhatDoiChieuDinhMuc(thoiGianChay);
}



function batDau() {
    if (trangThai === "chay") return;

    let hienTai = Date.now();
    let gioHienTai = new Date(hienTai).toLocaleTimeString("vi-VN");

    if (trangThai === "dung") {
        tongThoiGianDung += hienTai - mocDung;
    }

    // Mỗi lần bắt đầu chạy đều tạo mục lịch sử mới
    lichSu.push({
        gioDung: "",
        gioChayLai: gioHienTai
    });

    mocBatDau = hienTai;
    trangThai = "chay";

    luuDuLIieu();
    veLichSu();
    capNhatManHinh();

    if (dongHo === null) {
        dongHo = setInterval(capNhatManHinh, 250);
    }
}





function dung() {
    if (trangThai !== "chay") return;

    let hienTai = Date.now();
    let gioHienTai = new Date(hienTai).toLocaleTimeString("vi-VN");

    // Ghi giờ dừng vào mục chạy mới nhất
    if (lichSu.length > 0) {
        lichSu[lichSu.length - 1].gioDung = gioHienTai;
    }

    tongThoiGian += hienTai - mocBatDau;
    mocDung = hienTai;
    trangThai = "dung";

    luuDuLIieu();
    veLichSu();
    capNhatManHinh();

    if (dongHo === null) {
        dongHo = setInterval(capNhatManHinh, 250);
    }
}



function hienThiLichSu() {
    dangMoLichSu = !dangMoLichSu;

    document.getElementById("bangLichSu").style.display =
        dangMoLichSu ? "block" : "none";

    veLichSu();
}

function veLichSu() {
    let noiDung = "";

    for (let i = 0; i < lichSu.length; i++) {
        noiDung += `
            <tr>
                <td>${lichSu[i].gioDung}</td>
                <td>${lichSu[i].gioChayLai || "Chưa chạy lại"}</td>
            </tr>
        `;
    }

    document.getElementById("danhSachLichSu").innerHTML = noiDung;
}

// Khởi tạo ứng dụng
docDuLieu();
veLichSu();
capNhatManHinh();

if (trangThai === "chay" || trangThai === "dung") {
    dongHo = setInterval(capNhatManHinh, 250);
}




function taoBangPhoiLieu() {
    const oSoNguon = document.getElementById("soNguonPhoiLieu");
    const soNguon = Number(oSoNguon.value);

    if (!Number.isInteger(soNguon) || soNguon < 1) {
        alert("Số nguồn phải là số nguyên lớn hơn 0!");
        return;
    }

    const danhSach = document.getElementById("danhSachNguonPhoiLieu");
    danhSach.innerHTML = "";

    for (let i = 0; i < soNguon; i++) {
        const khung = document.createElement("div");
        khung.className = "nguon-phoi-lieu";

        khung.innerHTML = `
            <div class="thong-tin-nguon">
                <label>
                    Nguồn
                    <input type="text" class="ten-nguon"
                           placeholder="Tên nguồn ${i + 1}">
                </label>

                <label>
                    Tlê mục tiêu %
                    <input type="number" class="ti-le-muc-tieu"
                           min="0" step="any">
                </label>
            </div>

            <table class="bang-nguyen-lieu">
                <colgroup>
                    <col class="cot-sl">
                    <col class="cot-kg">
                    <col class="cot-ti-le">
                    <col class="cot-tong">
                    <col class="cot-chenh-lech">
                    <col class="cot-sl-ket-qua">
                </colgroup>

                <thead>
                    <tr>
                        <th>SL</th>
                        <th>KG/Bánh</th>
                        <th>Tỉ lệ %</th>
                        <th>TỔNG</th>
                        <th>CHÊNH LỆCH</th>
                        <th>SL</th>
                    </tr>
                </thead>

                <tbody class="cac-dong-nguyen-lieu">
                    <tr>
                        <td><input type="number" class="so-luong" min="0" step="any"></td>
                        <td><input type="number" class="kg-moi-banh" min="0" step="any"></td>
                        <td class="o-ti-le-thuc-te">—</td>
                        <td class="tong-vang">—</td>
                        <td rowspan="1" class="chenh-lech-nguon">—</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><input type="number" class="so-luong" min="0" step="any"></td>
                        <td><input type="number" class="kg-moi-banh" min="0" step="any"></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><input type="number" class="so-luong" min="0" step="any"></td>
                        <td><input type="number" class="kg-moi-banh" min="0" step="any"></td>
                        <td></td>
                        <td class="tong-xam">—</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><input type="number" class="so-luong" min="0" step="any"></td>
                        <td><input type="number" class="kg-moi-banh" min="0" step="any"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td rowspan="3" class="sl-muc-tieu-2">—</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2" class="o-them-dong">
                            <button type="button"
                                    onclick="themDongPhoiLieu(this)">
                                + Thêm dòng
                            </button>
                        </td>
                        <td></td>
                        <td class="tong-nguon">—</td>
                        <td class="tong-chenh-lech">—</td>
                        <td class="sl-dieu-chinh">—</td>
                    </tr>
                </tfoot>
            </table>
        `;

        danhSach.appendChild(khung);
    }
}

function themDongPhoiLieu(nut) {
    const khung = nut.closest(".nguon-phoi-lieu");
    const noiChua = khung.querySelector(".cac-dong-nguyen-lieu");
    const dong = document.createElement("tr");

    dong.innerHTML = `
        <td>
            <input type="number" class="so-luong" min="0" step="any">
        </td>
        <td>
            <input type="number" class="kg-moi-banh" min="0" step="any">
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    `;

    noiChua.appendChild(dong);
}




function layDuLieuPhoiLieu() {
    const cacNguon = document.querySelectorAll(
        "#danhSachNguonPhoiLieu .nguon-phoi-lieu"
    );

    return Array.from(cacNguon, (nguon) => {
        const cacDong = nguon.querySelectorAll(
            ".cac-dong-nguyen-lieu tr"
        );

        const dongDuLieu = Array.from(cacDong, (dong) => {
            const oSL = dong.querySelector(".so-luong");
            const oKG = dong.querySelector(".kg-moi-banh");

            return {
                sl: oSL.value.trim() === "" ? null : Number(oSL.value),
                kg: oKG.value.trim() === "" ? null : Number(oKG.value)
            };
        });

        const oTiLe = nguon.querySelector(".ti-le-muc-tieu");
        const tiLeText = oTiLe.value.trim();

        return {
            khung: nguon,
            cacDong: dongDuLieu,
            tiLeMucTieu: tiLeText === "" ? null : Number(tiLeText)
        };
    });
}

function tinhLaiPhoiLieu() {
    const oMucTieu = document.getElementById("mucTieuPhoiLieu");
    const mucTieuText = oMucTieu.value.trim();

    if (mucTieuText === "") {
        alert("Bạn chưa nhập tổng mục tiêu!");
        return;
    }

    const mucTieu = Number(mucTieuText);
    const cacNguon = layDuLieuPhoiLieu();

    if (!Number.isFinite(mucTieu) || mucTieu < 0) {
        alert("Mục tiêu phải là số không âm!");
        return;
    }

    if (cacNguon.length === 0) {
        alert("Bạn chưa tạo bảng phối liệu!");
        return;
    }

    for (const nguon of cacNguon) {
        if (
            nguon.tiLeMucTieu === null ||
            !Number.isFinite(nguon.tiLeMucTieu) ||
            nguon.tiLeMucTieu < 0
        ) {
            alert("Vui lòng nhập tỉ lệ mục tiêu hợp lệ cho tất cả nguồn!");
            return;
        }

        for (const dong of nguon.cacDong) {
            if (
                (dong.sl !== null &&
                    (!Number.isFinite(dong.sl) || dong.sl < 0)) ||
                (dong.kg !== null &&
                    (!Number.isFinite(dong.kg) || dong.kg < 0))
            ) {
                alert("SL và KG/Bánh phải là số không âm!");
                return;
            }
        }
    }

    const tongTiLe = cacNguon.reduce(
        (tong, nguon) => tong + nguon.tiLeMucTieu,
        0
    );

    if (Math.abs(tongTiLe - 100) > 0.1) {
        alert(
            `Tổng tỉ lệ mục tiêu là ${tongTiLe.toFixed(1)}%, chưa đủ 100%!`
        );
        return;
    }

    let tongTatCa = 0;
    let tongChenhLechTatCa = 0;

    for (const nguon of cacNguon) {
        let tongVang = 0;
        let tongXam = 0;

        for (let j = 0; j < nguon.cacDong.length; j++) {
            const dong = nguon.cacDong[j];

            // Giữ nguyên logic Python: thiếu SL hoặc KG thì bỏ qua dòng.
            if (dong.sl === null || dong.kg === null) {
                continue;
            }

            const tongDong = dong.sl * dong.kg;

            if (j < 2) {
                tongVang += tongDong;
            } else {
                tongXam += tongDong;
            }
        }

        const tongNguon = tongVang + tongXam;
        const mucTieuNguon = mucTieu * nguon.tiLeMucTieu / 100;
        const chenhLech = mucTieuNguon - tongNguon;

        // Tìm KG/Bánh khác 0 đầu tiên để tính số bánh điều chỉnh.
        const dongDieuChinh = nguon.cacDong.find(
            dong => dong.kg !== null && dong.kg !== 0
        );

        const soBanhDieuChinh = dongDieuChinh
            ? chenhLech / dongDieuChinh.kg
            : null;

        const tongVangO = nguon.khung.querySelector(".tong-vang");
        const tongXamO = nguon.khung.querySelector(".tong-xam");
        const tongNguonO = nguon.khung.querySelector(".tong-nguon");
        const chenhLechO = nguon.khung.querySelector(".chenh-lech-nguon");
        const tongChenhLechO = nguon.khung.querySelector(".tong-chenh-lech");
        const slDieuChinhO = nguon.khung.querySelector(".sl-dieu-chinh");
        const tiLeThucTeO = nguon.khung.querySelector(".o-ti-le-thuc-te");

        if (tongVangO) tongVangO.textContent = tongVang.toFixed(1);
        if (tongXamO) tongXamO.textContent = tongXam.toFixed(1);
        if (tongNguonO) tongNguonO.textContent = tongNguon.toFixed(1);

        if (chenhLechO) {
            chenhLechO.textContent = chenhLech.toFixed(1);
        }

        if (slDieuChinhO) {
            slDieuChinhO.textContent =
                soBanhDieuChinh === null
                    ? ""
                    : soBanhDieuChinh.toFixed(1);
        }

        tongTatCa += tongNguon;
        tongChenhLechTatCa += chenhLech;

        // Hiển thị tỉ lệ thực tế của nguồn.
        if (tiLeThucTeO) {
            const tiLeThucTe = tongTatCa === 0
                ? 0
                : tongNguon / (tongTatCa) * 100;

            tiLeThucTeO.textContent = tiLeThucTe.toFixed(1);
        }

        // Cập nhật tỉ lệ thực tế sau khi đã có tổng của tất cả nguồn.
        nguon.tongNguonTinhDuoc = tongNguon;
        nguon.chenhLechTinhDuoc = chenhLech;
    }

    // Tính lại tỉ lệ thực tế theo tổng tất cả nguồn.
    for (const nguon of cacNguon) {
        const oTiLeThucTe = nguon.khung.querySelector(".o-ti-le-thuc-te");

        if (oTiLeThucTe) {
            const tiLeThucTe = tongTatCa === 0
                ? 0
                : nguon.tongNguonTinhDuoc / tongTatCa * 100;

            oTiLeThucTe.textContent = tiLeThucTe.toFixed(1);
        }

        const oTongChenhLech = nguon.khung.querySelector(".tong-chenh-lech");
        if (oTongChenhLech) {
            oTongChenhLech.textContent = nguon.chenhLechTinhDuoc.toFixed(1);
        }
    }

    document.getElementById("tongTatCaPhoiLieu").textContent =
        tongTatCa.toFixed(1);

    document.getElementById("tongChenhLechPhoiLieu").textContent =
        tongChenhLechTatCa.toFixed(1);

        const thoiGianHienTai =
        tongThoiGian +
        (trangThai === "chay" ? Date.now() - mocBatDau : 0);

    capNhatDoiChieuDinhMuc(thoiGianHienTai);
}

function tinhMucTieu2PhoiLieu() {
    const oMucTieu2 = document.getElementById("mucTieu2PhoiLieu");
    const mucTieu2Text = oMucTieu2.value.trim();

    if (mucTieu2Text === "") {
        alert("Bạn chưa nhập mục tiêu 2!");
        return;
    }

    const mucTieu2 = Number(mucTieu2Text);

    if (!Number.isFinite(mucTieu2) || mucTieu2 < 0) {
        alert("Mục tiêu 2 phải là số không âm!");
        return;
    }

    const cacNguon = layDuLieuPhoiLieu();

    if (cacNguon.length === 0) {
        alert("Bạn chưa tạo bảng phối liệu!");
        return;
    }

    for (const nguon of cacNguon) {
        const oKetQua = nguon.khung.querySelector(".sl-muc-tieu-2");
        const kgDongDau = nguon.cacDong[0]?.kg;

        if (oKetQua) {
            oKetQua.textContent = "";

            if (
                nguon.tiLeMucTieu !== null &&
                Number.isFinite(nguon.tiLeMucTieu) &&
                kgDongDau !== null &&
                kgDongDau !== 0
            ) {
                const soBanh =
                    mucTieu2 * nguon.tiLeMucTieu / 100 / kgDongDau;

                oKetQua.textContent = soBanh.toFixed(1);
            }
        }
    }
}


function capNhatDoiChieuDinhMuc(thoiGianChayMs) {
    const dinhMuc = Number(
        document.getElementById("dinhMuc").value
    );

    const tongEl = document.getElementById("tongTatCaPhoiLieu");
    const tieuHaoText = tongEl.textContent.trim();
    const tieuHao = Number(tieuHaoText);

    const nlEl = document.getElementById("nlChuan");
    const tieuHaoEl = document.getElementById("tieuHaoThucTe");
    const chenhLechEl = document.getElementById("chenhLechDinhMuc");
    const canhBaoEl = document.getElementById("canhBaoDinhMuc");

    const dinhMucHopLe =
        Number.isFinite(dinhMuc) && dinhMuc >= 0;

    const tieuHaoHopLe =
        tieuHaoText !== "" &&
        Number.isFinite(tieuHao) &&
        tieuHao >= 0;

    if (!dinhMucHopLe || !tieuHaoHopLe) {
        nlEl.textContent = "Chưa có dữ liệu";
        tieuHaoEl.textContent = "Chưa có dữ liệu";
        chenhLechEl.textContent = "—";
        canhBaoEl.textContent = "KIỂM TRA DỮ LIỆU ĐẦU VÀO";
        canhBaoEl.className = "canh-bao-thap";
        return;
    }

    // Định mức kg/giờ × số giờ máy thực sự chạy.
    const nlChuan = dinhMuc * thoiGianChayMs / 3600000;

    // Dương = tiêu hao vượt NL; âm = tiêu hao thấp hơn NL.
    const chenhLech = tieuHao - nlChuan;

    // Ngưỡng căn cứ vào tổng tiêu hao thực tế.
    const nguong = tieuHao < 100000 ? 500 : 1000;

    const formatKg = so =>
        so.toLocaleString("vi-VN", {
            maximumFractionDigits: 1
        }) + " kg";

    nlEl.textContent = formatKg(nlChuan);
    tieuHaoEl.textContent = formatKg(tieuHao);

    chenhLechEl.textContent =
        (chenhLech > 0 ? "+" : "") + formatKg(chenhLech);

    canhBaoEl.className = "";

    if (chenhLech > nguong) {
        canhBaoEl.classList.add("canh-bao-vuot");
        canhBaoEl.textContent =
            "CẢNH BÁO: VƯỢT ĐỊNH MỨC " +
            formatKg(chenhLech) +
            " (ngưỡng ±" + formatKg(nguong) + ")";
    } else if (chenhLech < -nguong) {
        canhBaoEl.classList.add("canh-bao-thap");
        canhBaoEl.textContent =
            "CẢNH BÁO: THẤP HƠN ĐỊNH MỨC " +
            formatKg(Math.abs(chenhLech)) +
            " (ngưỡng ±" + formatKg(nguong) + ")";
    } else {
        canhBaoEl.classList.add("canh-bao-trong-nguong");
        canhBaoEl.textContent =
            "TRONG NGƯỠNG CHO PHÉP ±" + formatKg(nguong);
    }

}
document.getElementById("dinhMuc").addEventListener("input", () => {
    const thoiGianHienTai =
        tongThoiGian +
        (trangThai === "chay" ? Date.now() - mocBatDau : 0);

    capNhatDoiChieuDinhMuc(thoiGianHienTai);
});



if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service Worker đã đăng ký"))
            .catch(error => console.error("Lỗi Service Worker:", error));
    });
}

if (
    "serviceWorker" in navigator &&
    location.hostname !== "127.0.0.1" &&
    location.hostname !== "localhost"
) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service Worker đã đăng ký"))
            .catch(error => console.error("Lỗi Service Worker:", error));
    });
}