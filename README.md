# Insnugram Frontend

![GitHub Open PRs](https://img.shields.io/github/issues-pr/wafflestudio/22-5-team9-web?label=open%20PRs&color=blue&style=flat-square)
![GitHub Closed PRs](https://img.shields.io/github/issues-pr-closed/wafflestudio/22-5-team9-web?label=closed%20PRs&color=green&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/wafflestudio/22-5-team9-web?color=yellow&style=flat-square)

<p align="center">
    <img src="https://github.com/user-attachments/assets/53c84466-5fbf-4b62-93f5-0eef6af74472" alt="Insugram" width=300/>
</p>
<p align="center">
    <img width="182" alt="image" src="https://github.com/user-attachments/assets/49bbb46f-20f3-47c8-804e-dac8b7124caa"/>
</p>

## 📌 프로젝트 소개

**Insnugram**은 WaffleStudio의 22-5기 9팀의 인스타그램 서버 클론 코딩 프로젝트입니다. 인스타그램이 소셜 네트워크 서비스로서 가지고 있는 역할을 고려하며 재현했습니다. 인스트그램과 같이 주요 기능으로 포스트와 팔로우가 있으며, 추가로 스토리, 탐색, 검색까지 구현했습니다!
<br><br>인스누그램만의 유니크한 추가 기능으로 유저 위치 태그를 개발했습니다. 두 추가 기능은 인스타그램의 Socialize 목적에 맞춰 고안하였습니다.

- 위치 태그는 스누 캠퍼스에 있는 유저들이 위치를 지정하여 근처에 있는 친구들을 볼 수 있는 기능입니다.

## 🚀 기술 스택

### **프론트엔드 프레임워크**

<div>
    <a href="https://www.typescriptlang.org/">
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
    </a>
    <a href="https://tailwindcss.com/">
        <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
    </a>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
    </a>
    <a href="https://eslint.org/">
      <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
    </a>
    <a href="https://prettier.io/">
      <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white"/> 
    </a>
</div>

### **인증**

<div>
    <a href="https://developers.google.com/identity/sign-in/web/sign-in">
        <img src="https://img.shields.io/badge/Google%20OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
    </a>
</div>

### **커뮤니케이션**

<div>
    <a href="https://slack.com/">
        <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>
    </a>
    <a href="https://www.notion.so/">
        <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
    </a>
</div>

##

## 📂 프로젝트 구조

```bash
📦 22-5-team9-web
├── 📂 src                   # 주요 애플리케이션 코드
│   ├── 📂 api               # API 통신
│   │   ├── 📂 components    # 컴포넌트
│   │   │   ├── 📂 auth      # 구글 로그인
│   │   │   ├── 📂 dm        # DM 구조
│   │   │   ├── 📂 feed      # 피드
│   │   │   ├── 📂 layout    # 환경별 사이드바
│   │   │   ├── 📂 modals    # 모달
│   │   │   ├── 📂 post      # 포스트
│   │   │   ├── 📂 profile   # 프로필 페이지
│   │   │   ├── 📂 shared    # code snippet
│   │   │   ├── 📂 story     # 스토리
│   │   ├── 📂 comment       # 댓글
│   │   ├── 📂 hooks         # Hooks
│   │   ├── 📂 pages         # 페이지
│   │   ├── 📂 types         # 자주 쓰이는 인터페이스
│   │   ├── 📂 utils         # 토큰 갱신
│   │   ├── 📂 medium        # 미디어
│   │   ├── 📂 post          # 게시물
│   │   ├── 📂 story         # 스토리
│   │   └── 📂 user          # 유저
│   ├── App.tsx
├── 📜 yarn.lock             # 패키지 관리
```

## 🧑🏻‍💻🧑🏻‍💻 개발진

<div>
    <a href="https://aws.amazon.com/ec2/">
        <img src="https://custom-icon-badges.demolab.com/badge/LikeACloud7-박세준-eb4034?style=for-the-badge&logo=person-fill&logoColor=white"/>
    </a>
</div>

### 구현 기능

- post
- comment
- like
- search
- follow
- heart
- 추가(friend map)

<br>
<div>
    <a href="https://aws.amazon.com/ec2/">
        <img src="https://custom-icon-badges.demolab.com/badge/IceCandle-양진혁-3462eb?style=for-the-badge&logo=person-fill&logoColor=white"/>
    </a>
</div>

### 구현 기능

- auth
- profile
- story
- 리포 구조

## 🔗 배포 링크

<div>
    <a href="https://d3l72zsyuz0duc.cloudfront.net/"/>
        <img width="203" alt="image" src="https://github.com/user-attachments/assets/76ff852d-d2a0-493d-aace-485a981ab411" alt="Front"/>
    </a>
</div>
<div>
    <a href="https://waffle-instaclone.kro.kr/docs"/>
        <img width="203" alt="image" src="https://github.com/user-attachments/assets/2be0625f-6238-4101-a535-cfb32f4c9da9" alt="Back"/>
    </a>
</div>
