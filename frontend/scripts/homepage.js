/* Tài khoản không tìm thấy, đầu vào không hợp lệ */
/*
`<div class = "can-not-find">Không tìm thấy tài khoản!</div>`
`<div class = "can-not-find">Số tài khoản không hợp lệ!</div>`
`<div class = "can-not-find">Vui lòng nhập số tài khoản!</div>`
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
let soTaiKhoanLienQuan = '';
let sendTransaction = true;
let reciveTransaction = true;
let afterTime = '';
let beforeTime = '';
let minMoney = '';
let maxMoney ='';

//giá trị ban đầu khi chưa hoặc không nhập vào tìm kiếm cao

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchSettingForm').addEventListener('submit', handleFormSubmit);
})

async function handleFormSubmit(e){
  e.preventDefault();

  soTaiKhoanLienQuan = document.getElementById('soTaiKhoan').value;
  if(document.getElementById('sendTransaction').checked)
  {
    sendTransaction = true;
  } else {
    sendTransaction = false;
  }
  
  if(document.getElementById('reciveTransaction').checked)
  {
    reciveTransaction = true;
  } else {
    reciveTransaction = false;
  }

  afterTime = document.getElementById('afterDatetime').value;
  beforeTime = document.getElementById('beforeDatetime').value;
  
  minMoney = document.getElementById('minMoney').value;
  maxMoney = document.getElementById('maxMoney').value;
  
  if(((minMoney!='')&&(maxMoney!=''))&&Number(maxMoney)<Number(minMoney))
  {
    document.getElementById('errorStatus').innerText = 'Số tiền tối thiểu không thể lớn hơn số tiền tối đa!';
  }
  else if(((afterTime!='')&&(beforeTime)!='')&&Date(afterTime)>Date(beforeTime))
  {
    document.getElementById('errorStatus').innerText = 'Ngày bắt đầu phải trước ngày kết thúc!';
  }
  else
  {
    closeModal();
  }
}

window.openModal = function() {
  const modal = document.getElementById('searchSettingModal');
  modal.style.display = 'flex';
  document.getElementById('searchSettingForm').reset();
}

window.closeModal = function() {
  document.getElementById('errorStatus').innerText = '';
  document.getElementById('searchSettingModal').style.display = 'none';
}

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener( 'click' , () => {
  const inputElement = document.querySelector('.search-bar');
  if(inputElement.value === '')
  {
    document.querySelector('.result-content').innerHTML = '<div class = "can-not-find">Vui lòng nhập số tài khoản!</div>'
  }
});

