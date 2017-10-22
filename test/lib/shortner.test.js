const shortner = require("../../app/lib/shortner");

describe("shortner", () => {
  describe("#encode", () => {
    it("should get a number and return its string representation", () => {
      const str = shortner.encode(1);
      str.should.be.a.String();
    });
  });

  describe("#decode", () => {
    it("should get a string and return its number representation", () => {
      const number = shortner.decode("hello");
      number.should.be.a.Number();
    });
  });

  describe("#encode, #decode", () => {
    it("should transform a number to string and then convert it to the number", () => {
      const number = 6546789;

      const str = shortner.encode(number);
      const nbr = shortner.decode(str);

      nbr.should.be.eqls(number);
    });
  });
});
