import express from "express"
import { DeleteFile, createFolder, createFile, createRootFolder, getFile, getTree, updateFile } from "../controllers/file.controller.js"

const router = express.Router()

router.post("/create-root-folder",createRootFolder)
router.post("/create-folder",createFolder)
router.post("/create-file",createFile)
router.post("/update-file/:id",updateFile)
router.delete("/:id",DeleteFile)
router.get("/:id",getFile)
router.get("/tree/:projectId",getTree)

export default router