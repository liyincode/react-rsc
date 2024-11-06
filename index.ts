import express from "express";
import {htmlGenerator, jsxGenerator} from "./generator";
import {readFile} from "fs/promises";

const app = express();

app.get("/:route(*)", async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // 匹配 client.js
    if (url.pathname === "/client.js") {
        const content = await readFile("./client.js", "utf8");
        res.setHeader("Content-Type", "text/javascript");
        res.end(content);
    }
    // 如果网址有 jsx 参数，那就说明要获取 JSX 对象，我们改为调用 jsxGenerator 函数
    else if (url.searchParams.has("jsx")) {
        url.searchParams.delete("jsx");
        const clientJSXString = await jsxGenerator(url);
        res.setHeader("Content-Type", "application/json");
        res.end(clientJSXString);
    }
    else {
        const html = await htmlGenerator(url);
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    }
});

app.listen(3000, (err) => {
    if (err) return console.error(err);
    return console.log(`Server is listening on 3000`);
});
