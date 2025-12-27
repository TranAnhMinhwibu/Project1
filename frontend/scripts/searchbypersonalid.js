/* Tài khoản không tìm thấy, đầu vào không hợp lệ */
/*
`<div class = "can-not-find">Không tìm thấy tài khoản!</div>`
`<div class = "can-not-find">Số CCCD không hợp lệ!</div>`
`<div class = "can-not-find">Vui lòng nhập số CCCD!</div>`
 */

/* Thông tin khách
*/

/*
`
<div class="client-info">
  <p class="client-info-title">Thông tin khách hàng<p>
  <div class="client-info-element">
    <p class="client-info-specific"><strong>Số tài khoản:</strong> 123123123</p>
    <p class="client-info-specific client-info-right"><strong>Số CCCD:</strong> 12312312321</p>
  </div>
  <div class="client-info-element">
    <p class="client-info-specific"><strong>Họ tên:</strong> Trần Văn Phi</p>
    <p class="client-info-specific client-info-right"><strong>Ngày sinh:</strong> 09/11/2003</p>
  </div>
  <div class="client-info-element">
    <p class="client-info-specific"><strong>Quốc tịch:</strong> Việt Nam</p>
    <p class="client-info-specific client-info-right"><strong>Số dư:</strong> 100000đ</p>
  </div>
  <div class="client-info-element">
    <p class="client-info-specific"><strong>Số điện thoại:</strong> 092301231231</p>
    <p class="client-info-specific client-info-right"><strong>Email:</strong> tranvanphi@gmail.com</p>
  </div>
    <p class="client-info-specific"><strong>Địa chỉ:</strong> Số 1, Ngõ 33, Đường Vành Đai, Quận Long Biên, Thành phố Hà Nội</p>
</div>
`
*/

/* Thông tin giao dịch
*/

/*
`
<div class="transaction-info">
  <p class="transaction-info-title">Thông tin giao dịch</p>
  <div class="table-container">
    <table id="transaction-table">
      <thead>
        <tr>
          <th>Mã giao dịch</th>
          <th>Ngân hàng người gửi</th>
          <th>Số tài khoản gửi</th>
          <th>Ngân hàng người nhận</th>
          <th>Số tài khoản nhận</th>
          <th>Số tiền giao dịch</th>
          <th>Thời gian giao dịch</th>
          <th class="note-col">Ghi chú</th>
        </tr>
      </thead>
      <tbody class="transaction-data">
        <tr>
          <td>324324324</td>
          <td>ABBBank</td>
          <td>123123123</td>
          <td>ABDBank</td>
          <td>4534534534</td>
          <td>10000000đ</td>
          <td>22/12/2025</td>
          <td class="note-col note-col-data">Tiền mua hàng</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`
*/

/*document.querySelector('.result-content').innerHTML = '<div class = "can-not-find">Không tìm thấy tài khoản!</div>'*/

//variable cho tìm kiếm cao
import { renderClientInfo, renderTransactionTable, renderMessage } from './utils.js';

let soCCCDLienQuan = ''; // Lưu ý: Trong file HTML searchbypersonalid bạn dùng ID là soCCCD ở modal, nhưng logic nên là lọc theo STK liên quan
let sendTransaction = true;
let reciveTransaction = true;
let afterTime = '';
let beforeTime = '';
let minMoney = '';
let maxMoney = '';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-button').addEventListener('click', handleSearch);
    document.getElementById('searchSettingForm').addEventListener('submit', handleSettingSubmit);
});

async function handleSearch() {
    const inputElement = document.querySelector('.search-bar');
    const cccd = inputElement.value.trim();
    const resultContent = document.querySelector('.result-content');

    if (!cccd) {
        resultContent.innerHTML = renderMessage('Vui lòng nhập số CCCD!');
        return;
    }

    resultContent.innerHTML = '<div style="margin-top:15px">Đang tìm kiếm...</div>';

    try {
        const response = await fetch('http://localhost:3000/api/search/identity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                socialNumber: cccd, 
                relatedSocialNumber: soCCCDLienQuan, // <--- Gửi CCCD liên quan (người muốn lọc)
                afterTime, beforeTime, minMoney, maxMoney,
                sendTransaction, reciveTransaction
            })
        });

        const data = await response.json();

        if (!response.ok) {
            resultContent.innerHTML = renderMessage(data.message);
        } else {
            const html = renderClientInfo(data.client) + renderTransactionTable(data.transactions);
            resultContent.innerHTML = html;
        }
    } catch (err) {
        console.error(err);
        resultContent.innerHTML = renderMessage('Lỗi kết nối tới Server!');
    }
}

function handleSettingSubmit(e) {
    e.preventDefault();

    // 1. Lấy giá trị từ ô input có id="soCCCD"
    const cccdInput = document.getElementById('soCCCD').value.trim();
    soCCCDLienQuan = cccdInput; 
    
    sendTransaction = document.getElementById('sendTransaction').checked;
    reciveTransaction = document.getElementById('reciveTransaction').checked;
    afterTime = document.getElementById('afterDatetime').value;
    beforeTime = document.getElementById('beforeDatetime').value;
    minMoney = document.getElementById('minMoney').value;
    maxMoney = document.getElementById('maxMoney').value;

    if (minMoney && maxMoney && Number(maxMoney) < Number(minMoney)) {
        document.getElementById('errorStatus').innerText = 'Số tiền tối thiểu không thể lớn hơn tối đa!';
        return;
    }
    if (afterTime && beforeTime && new Date(afterTime) > new Date(beforeTime)) {
        document.getElementById('errorStatus').innerText = 'Ngày bắt đầu phải trước ngày kết thúc!';
        return;
    }
    
    closeModal();
}
window.closeModal = function() {
    document.getElementById('errorStatus').innerText = '';
    document.getElementById('searchSettingModal').style.display = 'none';
}