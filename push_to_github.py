"""
Quick GitHub Push Utility using pure-Python Git (Dulwich)
No native Git installation required!
"""

import sys
import getpass
from dulwich import porcelain

REPO_PATH = '.'
REMOTE_REPO = 'https://github.com/Abdul-Raheem-009/DBMS-Course-Project.git'

def push():
    print("==================================================")
    print("   Faculty Workload & Timetable Management System")
    print("              GitHub Push Assistant")
    print("==================================================")
    print(f"Target Repository: {REMOTE_REPO}\n")

    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()
    else:
        print("To push to GitHub, a Personal Access Token (PAT) is required.")
        print("You can generate one at: https://github.com/settings/tokens\n")
        token = input("Enter your GitHub Personal Access Token (or password): ").strip()

    if not token:
        print("Error: Token cannot be empty.")
        return

    # Build authenticated URL
    auth_url = f"https://{token}@github.com/Abdul-Raheem-009/DBMS-Course-Project.git"

    print("\nPushing repository to GitHub (branch: main)...")
    try:
        # Push master to main
        porcelain.push(REPO_PATH, auth_url, refspecs=['refs/heads/master:refs/heads/main'])
        print("\n✅ SUCCESS: All project files successfully pushed to https://github.com/Abdul-Raheem-009/DBMS-Course-Project !")
    except Exception as e:
        print(f"\n❌ Push failed: {e}")
        print("\nTip: Make sure your GitHub token has the 'repo' scope permission.")

if __name__ == '__main__':
    push()
