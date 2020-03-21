const aws = require("aws-sdk");
const { insertImage } = require("./db");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

const fs = require("fs");

exports.upload = (req, res, next) => {
    //if there is no file - tell AWS to not upload anything
    if (!req.file) {
        console.log("no file");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "francybucket",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise();

    promise
        .then(() => {
            console.log("image made it to amazon");
            next();
            fs.unlink(path, () => {}); // only if you want remove img from uploads folder
        })
        .catch(err => {
            console.log("err in putObject of s3.js", err);
            res.sendStatus(500);
        });
};
