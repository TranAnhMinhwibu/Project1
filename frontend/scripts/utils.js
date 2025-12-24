// Format tiền tệ (VD: 10.000.000đ)
export function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Format ngày tháng (VD: 22/12/2025 14:30:00)
export function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN');
}

// Format ngày sinh (chỉ ngày tháng năm)
export function formatDateOnly(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
}

// Hiển thị lỗi hoặc thông báo
export function renderMessage(message, isError = true) {
    return `<div class="can-not-find" style="color: ${isError ? 'red' : 'green'}">${message}</div>`;
}

// Render thông tin khách hàng
export function renderClientInfo(client) {
    if (!client) return '';
    return `
    <div class="client-info">
      <p class="client-info-title">Thông tin khách hàng</p>
      <div class="client-info-element">
        <p class="client-info-specific"><strong>Số tài khoản:</strong> ${client.AccountNumber}</p>
        <p class="client-info-specific client-info-right"><strong>Số CCCD:</strong> ${client.SocialNumber}</p>
      </div>
      <div class="client-info-element">
        <p class="client-info-specific"><strong>Họ tên:</strong> ${client.ClientName}</p>
        <p class="client-info-specific client-info-right"><strong>Ngày sinh:</strong> ${formatDateOnly(client.DateBirth)}</p>
      </div>
      <div class="client-info-element">
        <p class="client-info-specific"><strong>Quốc tịch:</strong> ${client.NationName}</p>
        <p class="client-info-specific client-info-right"><strong>Số dư:</strong> ${formatCurrency(client.Balance)}</p>
      </div>
      <div class="client-info-element">
        <p class="client-info-specific"><strong>Số điện thoại:</strong> ${client.PhoneNumber}</p>
        <p class="client-info-specific client-info-right"><strong>Email:</strong> ${client.Email}</p>
      </div>
        <p class="client-info-specific"><strong>Địa chỉ:</strong> ${client.ClientAddress}</p>
    </div>
    `;
}

// Render bảng giao dịch
export function renderTransactionTable(transactions) {
    if (!transactions || transactions.length === 0) {
        return '<div style="margin-top:20px; font-size:18px;">Không tìm thấy giao dịch nào thỏa mãn điều kiện.</div>';
    }

    const rows = transactions.map(t => `
        <tr>
          <td>${t.TransactionNumber}</td>
          <td>${t.SendBankName}</td>
          <td>${t.SendNumber}</td>
          <td>${t.ReceiveBankName}</td>
          <td>${t.ReceiveNumber}</td>
          <td>${formatCurrency(t.MoneySend)}</td>
          <td>${formatDate(t.TimeSend)}</td>
          <td class="note-col note-col-data">${t.Note || ''}</td>
        </tr>
    `).join('');

    return `
    <div class="transaction-info">
      <p class="transaction-info-title">Thông tin giao dịch</p>
      <div class="table-container">
        <table id="transaction-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>NH người gửi</th>
              <th>STK gửi</th>
              <th>NH người nhận</th>
              <th>STK nhận</th>
              <th>Số tiền</th>
              <th>Thời gian</th>
              <th class="note-col">Ghi chú</th>
            </tr>
          </thead>
          <tbody class="transaction-data">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
    `;
}