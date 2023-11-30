export function salesRaportEmailTemplate(total: number, avg: number) {
  return `
          <h1>Witaj Prezesie</h1>
          <p>Tak wyglada sprzedaz z dzisiejszego dnia.</p>
          <p>total: ${total}</p>
          <p>avg: ${avg}</p>
         `;
}
