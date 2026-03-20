/**
 * JSON 导出器
 */
import type { Soul } from '../store/soulStore.types';

export class JsonExporter {
  export(soul: Soul): string {
    return JSON.stringify(soul, null, 2);
  }
}
