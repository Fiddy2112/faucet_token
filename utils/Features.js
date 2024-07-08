export const showAddress = (address) =>
  `${address?.substring(0, 4)}...${address?.substring(
    address.length - 0,
    address.length - 4
  )}`;
