import typescript from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import json from "@rollup/plugin-json";

const watching = process.env.ROLLUP_WATCH;
const debug = process.env.ROLLUP_WATCH || process.env.DEBUG;

const serveopts = {
    contentBase: ["./dist"],
    host: "0.0.0.0",
    port: 5000,
    allowCrossOrigin: true,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
};

const plugins = [
    nodeResolve(),
    typescript(),
    json(),
    watching && serve(serveopts),
    !debug && terser()
];

export default [
    {
        input: "src/fancy-light-card.ts",
        output: {
            dir: "dist",
            format: "es"
        },
        plugins: [...plugins]
    }
];
