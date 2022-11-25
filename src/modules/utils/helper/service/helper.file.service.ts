import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Buffer } from 'exceljs';
import excelJs from 'exceljs';

@Injectable()
export class HelperFileService {
  private readonly appName: string;

  constructor(private readonly configService: ConfigService) {
    this.appName = this.configService.get<string>('app.name');
  }

  writeExcel(
    headers: string[],
    rows: Array<Record<string, string>>,
  ): Promise<Buffer> {
    const workbook = new excelJs.Workbook();
    workbook.creator = this.appName;
    workbook.lastModifiedBy = this.appName;
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.properties.date1904 = true;
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10_000,
        height: 20_000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible',
      },
    ];

    // sheet
    const worksheet = workbook.addWorksheet('Sheet 1', {
      views: [
        { state: 'frozen', xSplit: 1, ySplit: 1 },
        { showGridLines: true },
      ],
    });

    worksheet.columns = headers.map((val) => ({
      header: val,
    }));
    worksheet.addRows(rows);

    return workbook.xlsx.writeBuffer();
  }
}
