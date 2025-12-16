import os

# --- 配置区域 ---
OUTPUT_FILE = "project_context_optimized.txt"

# 1. 严格的黑名单（增加了常见的资源目录和库）
IGNORE_DIRS = {
    "node_modules", ".git", ".idea", ".vscode", "__pycache__",
    "dist", "build", "out", "target", "venv", "bin", "obj", ".gradle",
    "coverage", "logs", "assets", "public", "images", "img" # 忽略资源文件夹
}

# 2. 明确忽略的具体文件名（关键！大大节省Token）
IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "composer.lock",
    "Cargo.lock", "go.sum", ".DS_Store", "README.md", "LICENSE"
}

# 3. 允许的后缀（去掉了容易包含大数据的 .json, .xml, .sql，除非你明确需要）
# 如果你需要看特定的 json 配置，最好手动单独发给我
INCLUDE_EXTS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".c", ".cpp", ".h",
    ".vue", ".svelte", ".go", ".rs", ".php", ".rb", ".css", ".scss"
    # 注意：我移除了 .json 和 .html(除非是模板), .md, .txt 以防止无关文档干扰
}

# 4. 单个文件大小限制 (例如：超过 50KB 的代码文件通常是库或生成的，AI读不懂也不需要读)
MAX_FILE_SIZE = 50 * 1024  # 50KB
# ----------------

def pack_files():
    total_files = 0
    skipped_large_files = 0

    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        root_dir = os.getcwd()

        for root, dirs, files in os.walk(root_dir):
            # 过滤目录
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                # 过滤具体文件名
                if file in IGNORE_FILES:
                    continue

                # 过滤后缀
                _, ext = os.path.splitext(file)
                if ext.lower() in INCLUDE_EXTS and file != os.path.basename(__file__) and file != OUTPUT_FILE:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, root_dir)

                    try:
                        # 检查文件大小
                        if os.path.getsize(file_path) > MAX_FILE_SIZE:
                            print(f"⚠️ 跳过大文件 (>50KB): {rel_path}")
                            skipped_large_files += 1
                            continue

                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()

                        out_f.write(f"\n{'='*20}\n")
                        out_f.write(f"File: {rel_path}\n")
                        out_f.write(f"{'='*20}\n")
                        out_f.write(content + "\n")

                        print(f"已打包: {rel_path}")
                        total_files += 1
                    except Exception as e:
                        print(f"跳过文件 {rel_path}: {e}")

    print(f"\n{'='*30}")
    print(f"打包完成！")
    print(f"有效代码文件: {total_files} 个")
    print(f"跳过过大文件: {skipped_large_files} 个")
    print(f"输出文件: {OUTPUT_FILE}")
    print(f"{'='*30}")

    # 检查最终文件大小
    final_size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"最终文件大小: {final_size_mb:.2f} MB")
    if final_size_mb > 1:
         print("⚠️ 注意：文件仍然较大 (>1MB)，可能包含约 30万 Token，请尝试分段发送或仅发送 src 目录。")
    else:
         print("✅ 文件大小适中，可以直接发送。")

if __name__ == "__main__":
    pack_files()