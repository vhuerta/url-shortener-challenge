const router = require("express").Router();
const url = require("./url");
var Ajv = new require("ajv")();

const parse = url => ({
  url: url.url,
  hash: url.hash,
  hits: url.hits || 0
});

router.get("/:hash", async (req, res, next) => {
  const source = await url.getUrl(req.params.hash);

  // Behave based on the requested format using the 'Accept' header.
  // If header is not provided or is */* redirect instead.
  const accepts = req.get("Accept");

  if (!source) {
    switch (accepts) {
      case "text/plain":
        res.send(404);
        break;
      case "application/json":
        next({ status: 404, message: "Not found" });
        break;
      default:
        res.send(404);
        break;
    }
  }

  switch (accepts) {
    case "text/plain":
      res.end(source.url);
      break;
    case "application/json":
      res.json(parse(source));
      break;
    default:
      try {
        await url.hit(source.id);
      } catch (err) {
        console.error(err);
      }
      res.redirect(source.url);
      break;
  }
});

var validate = Ajv.compile({
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "url"
    }
  },
  required: ["url"]
});

router.post("/", async (req, res, next) => {
  if (validate(req.body)) {
    try {
      let shortUrl = await url.shorten(req.body.url, await url.generateHash());
      res.json(shortUrl);
    } catch (e) {
      next(e);
    }
  } else {
    next({ status: 422, message: "Verify data", data: validate.errors });
  }
});

router.delete("/:hash/remove/:removeToken", async (req, res, next) => {
  try {
    let removed = await url.remove(req.params.hash, req.params.removeToken);
    if (removed) {
      res.json({
        status: 200,
        message: "Url removed"
      });
    } else {
      next({ status: 404, message: "Not found" });
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
