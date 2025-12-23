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

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', () => {
  const inputElement = document.querySelector('.search-bar');
  if(inputElement.value === '')
  {
    document.querySelector('.result-content').innerHTML = '<div class = can-not-find>Vui lòng nhập mã giao dịch!</div>';
  }
});

