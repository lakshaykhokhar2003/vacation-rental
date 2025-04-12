import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "utfs.io",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "vn06itx8ks.ufs.sh",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
