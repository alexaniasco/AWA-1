
import sys

def find_context(file_path, search_str, context_bytes=500):
    with open(file_path, 'rb') as f:
        content = f.read()
        idx = content.find(search_str.encode('utf-8'))
        if idx == -1:
            print(f"String '{search_str}' not found.")
            return
        
        start = max(0, idx - context_bytes)
        end = min(len(content), idx + len(search_str) + context_bytes)
        
        context = content[start:end]
        print(f"Found '{search_str}' at index {idx}")
        print("--- CONTEXT ---")
        print(context.decode('utf-8', errors='replace'))
        print("--- END CONTEXT ---")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python find_str.py <file_path> <search_str>")
    else:
        find_context(sys.argv[1], sys.argv[2])
