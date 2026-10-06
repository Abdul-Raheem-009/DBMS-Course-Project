import os
from dulwich import porcelain
from dulwich.repo import Repo

repo_path = os.path.dirname(os.path.abspath(__file__))
remote_url = "https://github.com/Abdul-Raheem-009/DBMS-Course-Project.git"

# 1. Initialize repository if not already initialized
if not os.path.exists(os.path.join(repo_path, ".git")):
    repo = porcelain.init(repo_path)
    print("Initialized empty Git repository.")
else:
    repo = Repo(repo_path)
    print("Git repository already exists.")

# 2. Add all files
porcelain.add(repo_path)
print("Staged all project files.")

# 3. Commit
try:
    commit_sha = porcelain.commit(
        repo_path,
        message=b"Initial commit: Faculty Workload and Timetable Management System with MySQL Workbench support",
        author=b"Abdul-Raheem-009 <abdulraheem@apex.edu>",
        committer=b"Abdul-Raheem-009 <abdulraheem@apex.edu>"
    )
    print(f"Committed changes with SHA: {commit_sha.decode('utf-8')}")
except Exception as e:
    print(f"Commit note: {e}")

# 4. Check / Configure Remote
config = repo.get_config()
try:
    porcelain.remote_add(repo, "origin", remote_url)
    print(f"Added remote 'origin' -> {remote_url}")
except Exception as e:
    print(f"Remote note: {e}")

print("Git repository initialized and committed successfully!")
