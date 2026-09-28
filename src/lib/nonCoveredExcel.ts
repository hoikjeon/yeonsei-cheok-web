import ExcelJS from 'exceljs';
import { orderedFeeItems, historyDescription, type FeeSnapshot, type FeeHistory } from './nonCovered';

export async function buildFeeWorkbook(snapshot: FeeSnapshot, history: FeeHistory[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = '연세척병원';
  const sheet = workbook.addWorksheet('비급여 안내');
  sheet.columns = [
    { key: 'sectionTitle', width: 29 }, { key: 'categoryName', width: 27 }, { key: 'name', width: 52 },
    { key: 'code', width: 20 }, { key: 'division', width: 17 },
    { key: 'cost', width: 16 }, { key: 'minCost', width: 16 }, { key: 'maxCost', width: 16 },
    { key: 'materialIncluded', width: 20 }, { key: 'drugIncluded', width: 18 },
    { key: 'note', width: 38 }, { key: 'updateDate', width: 16 },
  ];
  sheet.mergeCells('A1:L1'); sheet.getCell('A1').value = '연세척병원 비급여 안내';
  sheet.mergeCells('A2:L2'); sheet.getCell('A2').value = `기준일: ${snapshot.content.publishedDate} / 금액 단위: 원`;
  sheet.addRow(['대분류', '분류', '명칭', '코드', '구분', '비용', '최저비용', '최고비용', '치료재료대 포함여부', '약제비 포함여부', '특이사항', '최종변경일']);
  for (const item of orderedFeeItems(snapshot.content)) sheet.addRow({ ...item, updateDate: item.updateDate.replaceAll('-', '.') });
  sheet.views = [{ state: 'frozen', ySplit: 3, xSplit: 2 }];
  sheet.autoFilter = { from: 'A3', to: `L${sheet.rowCount}` };
  for (const key of ['cost', 'minCost', 'maxCost']) sheet.getColumn(key).numFmt = '#,##0';
  sheet.getColumn('code').numFmt = '@';
  sheet.eachRow((row, rowNumber) => {
    row.alignment = { vertical: 'middle', wrapText: true };
    row.height = rowNumber <= 3 ? 28 : 44;
    row.font = { name: '맑은 고딕', size: rowNumber === 1 ? 16 : 10, bold: rowNumber <= 3 };
    if (rowNumber === 3) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF243F83' } };
      row.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    }
  });
  const log = workbook.addWorksheet('변경 내역');
  log.columns = [
    { header: '변경일시 (한국시간)', key: 'date', width: 25 }, { header: '변경 구분', key: 'action', width: 16 },
    { header: '항목', key: 'label', width: 45 }, { header: '변경 전', key: 'before', width: 75 }, { header: '변경 후', key: 'after', width: 75 },
  ];
  log.views = [{ state: 'frozen', ySplit: 1 }];
  for (const record of history) {
    const row = log.addRow({ date: new Date(record.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), action: record.action, label: record.label, before: historyDescription(record.before_value), after: historyDescription(record.after_value) });
    row.alignment = { wrapText: true, vertical: 'top' }; row.height = 60;
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: record.action === '삭제' ? 'FFFEE2E2' : record.action === '추가' || record.action === '복원' ? 'FFDCFCE7' : 'FFFEF9C3' } };
  }
  log.getRow(1).font = { bold: true };
  log.autoFilter = { from: 'A1', to: `E${Math.max(1, log.rowCount)}` };
  return workbook;
}
