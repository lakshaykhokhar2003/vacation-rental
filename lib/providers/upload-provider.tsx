"use client"
import {generateUploadDropzone,} from "@uploadthing/react";
import {OurFileRouter} from "@/app/api/uploadthing/core";


export const UTUploadDropzone = generateUploadDropzone<OurFileRouter>();
