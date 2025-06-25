import { nightsBetween } from '../src/utils/dateUtils';

describe('Utilitário de datas', () => {
  it('Calcula correctamente número de noites', () => {
    const nights = nightsBetween(
      new Date('2025-07-01'),
      new Date('2025-07-05'),
    );
    expect(nights).toBe(4);
  });
});
