/** Datos de comprador ficticios: Sauce Demo no valida su formato ni los guarda. */
export type Buyer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const buyer: Buyer = {
  firstName: 'Ana',
  lastName: 'Pérez',
  postalCode: '0000',
};
