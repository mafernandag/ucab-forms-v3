export const stringifyRows = (rows: any[]) => {
  return rows.map((row) => {
    const newRow = row
      .map((cell: string) => {
        return [cell];
      })
      .map((cell: any[], i: number) => {
        if (i > 0) {
          return cell.join("; ");
        }
        return cell;
      });

    return newRow;
  });
};
