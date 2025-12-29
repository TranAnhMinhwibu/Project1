/*Không tìm thấy giao dịch
*/

/*
`<div class = can-not-find>Không tìm thấy giao dịch!</div>`
`<div class = can-not-find>Mã giao dịch không hợp lệ!</div>`
`<div class = can-not-find>Vui lòng nhập mã giao dịch!</div>`
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

import { renderMessage, formatCurrency, formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-button').addEventListener('click', handleSearch);
});

async function handleSearch() {
    const inputElement = document.querySelector('.search-bar');
    const transID = inputElement.value.trim();
    const resultContent = document.querySelector('.result-content');

    if (!transID) {
        resultContent.innerHTML = renderMessage('Vui lòng nhập mã giao dịch!');
        return;
    }

    resultContent.innerHTML = '<div style="margin-top:15px">Đang tìm kiếm...</div>';

    try {
        const response = await fetch(`http://192.168.1.10:3000/api/search/transaction/${transID}`);
        const data = await response.json();

        if (!response.ok) {
            resultContent.innerHTML = renderMessage(data.message);
        } else {
            // Hiển thị chi tiết 1 giao dịch
            // Chúng ta reuse bảng nhưng chỉ có 1 dòng
            const t = data;
            const html = `
            <div class="transaction-info" style="margin-top: 30px;">
              <p class="transaction-info-title">Chi tiết giao dịch: ${t.TransactionNumber}</p>
              <div class="table-container">
                <table id="transaction-table">
                  <thead>
                    <tr>
                      <th>Ngân hàng gửi</th>
                      <th>STK gửi</th>
                      <th>Ngân hàng nhận</th>
                      <th>STK nhận</th>
                      <th>Số tiền</th>
                      <th>Thời gian</th>
                      <th class="note-col">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${t.SendBankName}</td>
                      <td>${t.SendNumber}</td>
                      <td>${t.ReceiveBankName}</td>
                      <td>${t.ReceiveNumber}</td>
                      <td>${formatCurrency(t.MoneySend)}</td>
                      <td>${formatDate(t.TimeSend)}</td>
                      <td class="note-col note-col-data">${t.Note || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            `;
            resultContent.innerHTML = html;
        }
    } catch (err) {
        console.error(err);
        resultContent.innerHTML = renderMessage('Lỗi kết nối tới Server!');
    }
}
