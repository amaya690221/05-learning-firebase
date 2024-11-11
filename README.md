# React + TypeScript + Vite

# 学習記録アプリ、Firebase認証・DB連携版

### 実現したい内容
一度作成した、react-firebase-authに対し
- カスタムフック利用 ・・・Firebase関連処理はすべてここに集約
- useFormの利用　→　一旦断念
- type, utilsフォルダを設ける

### 手順

```sh
npm create vite@latest
✔ Project name: … learning-firebase
✔ Select a framework: › React
✔ Select a variant: › TypeScript

  cd learning-firebase
  npm install
  npm run dev
```
#### firebaseプロジェクト作成
react-firebase-auth、既存のものそのまま

#### アプリの追加 
react-auth、既存のものそのまま
https://reffect.co.jp/react/react-firebase-auth

#### Firestoreの追加


#### Firebase SDK
```sh
npm i firebase
```
関連コンポーネントのコピー
- .env.local を/に
- studyData.ts を/src/types/に

Chakra UI ,React icon, React Router
```sh
npm i @chakra-ui/react@2.10.3 @emotion/react @emotion/styled framer-motion react-icons react-router-dom
npm i @chakra-ui/toast
```
なお、Chakra UIのToastはアップデートされたようで（v2からv3になってた、 "@chakra-ui/react": "^3.0.1",）  
今までのインポートではうまく行かなかったので、下の、npm i @chakra-ui/toastを追加
インポートも@chakra-ui/toastから、なおインポートもはサイトの情報とは異なり、{}で囲まないとエラーになった。  
→その後、V3だと構造が結構変わってるようで、色々今までと違う箇所出てきた。ので、V2系に戻すことにした、  
uninstall後、
```
npm i @chakra-ui/react@2.10.3
```

続いて、まずは、カスタムフックを作成してみる。・・・と思ったが、ブログの構成としては、それぞれの処理を一つずつ
実装しながら、確認しながら、次のステップに進む構成となるので、一旦は普通に作って最後にカスタムフック化の流れかな。


目次案
- 環境構築
  - Reactプロジェクトの作成
  - Firebaseプロジェクトの作成
  - Firebaseアプリの作成、認証設定
  - FirebaseSDKの環境作成
  - Firestoreの設定・作成
- ベースデザインの作成
  - main.tsx, App.tsx
  - Login.tsx
  - Home.tsx
- ログイン機能
  - カスタムフック作成
  - カスタムフックの実装
- DB表示
  - カスタムフック変更
- DB更新
- DB新規登録
- DB削除
- ログアウト機能
- サインアップ機能
- パスワードリセット機能

★Firestoreのルールについて、
本来、セキュリティ的には、認証ユーザ＋データ作成ユーザにのみ許可を行う事が望ましい。  
→試しに、allow read, write: if request.auth != null && request.auth.uid == userId
　で設定したところ、どのIDでログインしてもデータ見れなくなった・・・。gmailアカウントでやっても(それで作成したデータも）ダメなので  
　gmailアカウントは別のID情報を持ってる模様

useFormの活用、ChatGPTに支持いただき
```
npm i react-hook-form
```
- interfaceの定義が必要 →　馴染んでいる　typeでの設定とした。
- const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  - register:フォームから入力された値のstate管理、バリデーション処理が可能
  - handleSubmit:フォームをsubmitした時の処理をかけます。handleSubmit()は引数を二つ受け取ります。引数1はバリデーション処理がOKの場合の関数、引数2はバリデーション処理がNGの場合に呼ばれる関数が入ります。
  - formState:フォームの状態をobjectで管理。一番利用するのはerrors。formState: { errors, isDirty, isSubmitting, touchedFields, submitCount }
https://zenn.dev/redpanda/articles/4dba043cd753e3

カスタムフック
- まずは、ログイン機能を実装。  
Login.tsxにてuseFormとの整合性で問題あり。useFormが期待している、引数・型とuseFirbaseでのログイン関数とが不一致の為。  
また、useFormを利用すれば、例えば、email,passwordと言ったフォーム入力値はuseFormでstate管理がなされるので、個別のstate化は不要。  
しかし、本アプリの実装においては、emailをstate化して、DB処理にも利用する必要があるため、個別にstate化を図ることにする。  
useFormを活用しきれていないのと、試行錯誤感強いけど。
https://chatgpt.com/c/672203da-4d78-8002-ad2f-a37ee6ed097f
- 開発を進めていくにつれ、どうにもuseFookを効果的に使える気がしなく、断念する。stateが色々重複してしまい、効率的な使い方が見いだせない。

- DBフェッチ機能を作成。どうもカスタムフックにすると、emailを依存関数にしたuseEffectによるfetchDbがうまくデータ拾ってこれない（emailがセットされる前に処理がなされてる模様）  
と言うことで、元々のreact-firebase-authで実装していた、セッションuser情報取得の処理を利用して、userを依存関数にフェッチさせるとうまく動作した。  
この実装の中で、setEmailをuserの情報で実施しているので、ログイン情報入力時のsetEmailは不要かも → useFormの使い道もある。  
ひとまずは、このまま進めますが、DBデータの新規登録、編集を考えても、すんなりuseFormが進むとも思えず

- 一旦前編部分は完了、GitHubにもプッシュ済、ブランチも前編終了時として格納

#### 後編
まず、目次は、新規登録ユーザはDBに何もない状態なので、何もDB操作が出来ないので、先にDB操作を実装した方が良いと判断。  
また、DB機能は、新規登録が学習記録アプリの性質上、既存タイトルと被った場合、既存タイトルの時間を更新する形にしているため、先にDB更新を実装するのが合理的と考えた。上記目次も更新済

- Edit.tsxの実装で問題が。  
DB更新は問題なく処理されるのだけど、その後のfetchDbで取得したlearningsがうまくHome.tsxに反映されない。これは元々作成したreact-firebase-auth際は、Home.tsxに関数等を実装していたが、  
今回はカスタムフック経由でPropsや関数を渡しているからなのか、どうもsetStateの非同期処理がうまく反映されない 。ChatGPTでだいぶ試行錯誤したけど。
- Edit.tsxの内容をHome.tsxに移植したらうまく動作するようになった。これは単一コンポーネントでやるとなると複雑になりそうな・・・。  
こんな記事もあり。https://qiita.com/torihazi/items/d1f66c832d92054ff831
- modalEdit = useDisclosure()のように、モーダル毎にuseDisclosureを定義
- Homeコンポーネントに集約するとして、learningのローカルステートについては、登録・更新・削除は共通のものを準備しようと思っていたが、  
そうすると、編集画面で入力されたstateが新規登録時にも表示される等、制御が複雑になるので、シンプルに用途毎に設けることにする。  
これに伴い、handleInputChange関連の関数の変更も必要。汎用性を持たせるために、引数として、state,setStateをもたせることも考えたけど、
そうするとJSXで記載する、onChangeイベントの箇所の記述も多くなり、あまり外だしするメリットを感じなかったので、JSX内のonChange処理で
記載する方式に変更
- その後は順調に推移、特に特記事項はないが、Home.tsxのコード量がだいぶ増えたのと、wordpress的にも大分負荷が高くなっているかな。  
DB何回かぶっ飛んだ。

ひとまず、執筆完了。