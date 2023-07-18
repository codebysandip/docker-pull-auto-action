const core = require('@actions/core');

const obj = {
    dockerImage: core.getInput("docker-image"),
    dockerTag: core.getInput("docker-tag"),
    domain: core.getInput("domain"),
    hookSecret: core.getInput("hook-secret"),
    overHttp: JSON.parse(core.getInput("over-http")),
    port: JSON.parse(core.getInput("port"))
};

try {
    new URL(`http://${obj.domain}`);
} catch {
    console.error(`Invalid domain ${obj.domain}. Example value example.com or sub.example.com`);
    process.exit(1);
}
// for local testing
// const obj = {};
// const args = process.argv.slice(2);
// args.forEach((arg) => {
//     const splittedVal = arg.split("=");
//     obj[splittedVal[0]] = splittedVal[1] || true;
// });

if (!obj.dockerImage) {
    console.error("docker image not passed as parameter. Example dockerImage=sandipj/react-ssr-doc");
    process.exit(1);
}

if (!obj.dockerTag) {
    console.error("docker tag not passed as parameter. Example tag: v1.0");
    process.exit(1);
}

if (!obj.domain) {
    console.error("domain not passed as parameter. Example domain: mydomain.com");
    process.exit(1);
}
if (!obj.hookSecret) {
    console.error("hook secret not passed as parameter. Example hook-secret: v1.0");
    process.exit(1);

}

if (obj.overHttp) {
    console.log(`request will send over http  on domain ${obj.domain}`);
} else {
    console.log(`request will send over https on domain ${obj.domain}`);
}

const adapter = obj.overHttp ? require("http") : require("https");

const data = {
    dockerImage: obj.dockerImage,
    dockerImageTag: obj.dockerTag,
};

const { createHmac } = require("crypto");

const dataStr = JSON.stringify(data);

console.log("Body of request ", dataStr);

const signature = createHmac("sha256", obj.hookSecret).update(dataStr).digest("hex");
const header = `sha256=${signature}`;

const options = {
    host: obj.domain,
    port: obj.port || 443,
    path: "/api/webhook",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(dataStr),
        "x-hub-signature-256": header,
    },
};

const req = adapter.request(options, function (res) {
    console.log("STATUS: " + res.statusCode);
    res.setEncoding("utf8");
    let respBodyStr = "";
    res.on("data", function (chunk) {
        respBodyStr += chunk;
    });

    res.on("end", () => {
        console.log("response!!", respBodyStr);
    });
});

req.on("error", function (e) {
    console.log("problem with request: " + e.message);
});

// write data to request body
req.write(dataStr);
req.end();
