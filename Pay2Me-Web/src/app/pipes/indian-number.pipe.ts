import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'indianNumber' })
export class IndianNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined, fractionDigits: number = 0): string {
    if (value === null || value === undefined || value === '') {
      return 'No Balance';
    }

    const n = Number(value);
    if (isNaN(n)) {
      return 'No Balance';
    }

    // Show exact 0 as "0"
    if (n === 0) {
      // if fractionDigits > 0, show decimals
      return fractionDigits > 0 ? n.toFixed(fractionDigits) : '0';
    }

    const neg = n < 0;
    const absValue = Math.abs(n);

    // Prepare fixed decimal part
    const fixed = fractionDigits >= 0 ? absValue.toFixed(fractionDigits) : String(absValue);
    const parts = fixed.split('.');
    let intPart = parts[0];
    const decPart = parts[1] ? '.' + parts[1] : '';

    // Indian grouping: last 3 digits, then groups of 2
    const lastThree = intPart.slice(-3);
    let rest = intPart.slice(0, -3);

    if (rest !== '') {
      // Insert commas every 2 digits from the right in `rest`
      rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      intPart = rest + ',' + lastThree;
    } else {
      intPart = lastThree;
    }

    return (neg ? '-' : '') + intPart + decPart;
  }
}
