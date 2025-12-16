import os

# --- 配置区域 ---
# 输出文件的名字
OUTPUT_FILE = "project_context.txt"

# 不需要扫描的文件夹（黑名单）
IGNORE_DIRS = {
    "node_modules", ".git", ".idea", ".vscode", "__pycache__",
    "dist", "build", "venv", "bin", "obj", ".gradle"
}

# 需要包含的文件后缀（白名单，只读取代码文件）
# 如果你的代码有其他后缀，可以在这里添加
INCLUDE_EXTS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".c", ".cpp", ".h",
    ".html", ".css", ".json", ".sql", ".md", ".txt", ".xml", ".yml", ".yaml",
    ".go", ".rs", ".php", ".rb"
}
# ----------------

def pack_files():
    total_files = 0
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        # 获取当前脚本所在目录
        root_dir = os.getcwd()

        for root, dirs, files in os.walk(root_dir):
            # 1. 过滤掉不需要的文件夹（原地修改dirs列表）
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                # 2. 检查后缀名
                _, ext = os.path.splitext(file)
                if ext.lower() in INCLUDE_EXTS and file != "packer.py" and file != OUTPUT_FILE:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, root_dir)

                    try:
                        # 3. 读取内容并写入
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()

                        # 写入分隔符和文件名，方便AI识别
                        out_f.write(f"\n{'='*20}\n")
                        out_f.write(f"File: {rel_path}\n")
                        out_f.write(f"{'='*20}\n")
                        out_f.write(content + "\n")

                        print(f"已打包: {rel_path}")
                        total_files += 1
                    except Exception as e:
                        print(f"跳过文件 {rel_path} (无法读取): {e}")

    print(f"\n完成！共打包了 {total_files} 个文件。")
    print(f"请把目录下的 [{OUTPUT_FILE}] 发送给 Gemini。")

if __name__ == "__main__":
    pack_files()