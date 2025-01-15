
export const generateBill = (data) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
    return `
    <html>
      <head>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          body {
            width: 58mm;
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          .receipt {
            padding: 0 10px;
          }
          .header{
            margin-top:10px;
          }
          .header, .footer {
            text-align: center;
          }
          .alamat {
            display:flex;
            flex-direction:column;
            gap:4px;
          }
          .tableTrx {
              width: 100%;
              font-size: 12px;
              margin-top:5px;
          }
          .tableItem {
              width: 100%;
              font-size: 10px;
          }
          .line {
            border-bottom: 1px dashed #000;
          }
          .tableItem tr td {
            border-bottom: 1px dashed #000; /* Garis putus-putus di bawah baris */
            margin:2px;
          }
          .content {
            margin-top:2px;
            text-align: left;
            display:flex;
            flex-direction:column;
            gap:5px;
          }
          .item {
            display: flex;
            justify-content: space-between; 
            gap:2px;
          }
          .doubleLine{
            margin-top:5px;
            display:flex;
            flex-direction:column;
            gap:2px;
          }
          .summary {
            display:flex;
            justify-content: space-between;
              font-size: 10px;
          }
          .containerSummary {
            margin-top:5px;
            display:flex;
            gap:4px;
            flex-direction:column;
          }
          .tipePembayaran{
            text-transform: capitalize;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h2>Langit Coffe</h2>
            <div class="alamat">
            <span>Jl. Contoh Alamat, No. 123</span>
            <span>Telp: 081234567890</span>
            </div>
          </div>
          <div class="doubleLine">
            <div class="line"></div>
            <div class="line"></div>
          </div>
          <table class="tableTrx">
            <tr>
              <td>ID Transaksi</td>
              <td>:</td>
              <td>#${data.id}</td>
            </tr>
            <tr>
              <td>Waktu</td>
              <td>:</td>
              <td>${data.waktu_pembayaran}</td>
            </tr>
            <tr>
              <td>Kasir</td>
              <td>:</td>
              <td>${data.kasir}</td>
            </tr>
            <tr>
              <td>Pembayaran</td>
              <td>:</td>
              <td style="text-transform:capitalize">${data.tipe_pembayaran}</td>
            </tr>
          </table>
          <div class="line" style="margin-bottom:10px;"></div>
          <div class="content">
            <table class="tableItem" cellpadding="2">
              ${data.detail.map(item => `
                <tr >
                  <td valign="top">${item.quantity}</td>
                  <td >${item.menu.nama} (${item.temperatur})</td>
                  <td valign="top" width="25%" >${formatCurrency(item.total,'IDR')}</td>
                </tr>
              `).join('')}
            </table>
            <div class="containerSummary">
              <div class="summary">
                <span><strong>Total Tagihan</strong></span>
                <span>${formatCurrency(data.jumlah,'IDR')}</span>
              </div>
              ${
                  data.tipe_pembayaran === 'cash'
                    ? `<div class="summary">
                        <span><strong>Total Bayar</strong></span>
                        <span>${formatCurrency(data.jumlah_diberikan,'IDR')}</span>
                      </div>
                      <div class="summary">
                        <span><strong>Kembalian</strong></span>
                        <span>${formatCurrency(data.jumlah_kembalian,'IDR')}</span>
                      </div>`
                    : ''
                }
            </div>
          </div>
          <div class="footer">
            <p>Terima Kasih!</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
