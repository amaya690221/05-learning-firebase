// /src/hooks/useFirebse.ts
import { useEffect, useState } from "react";//useEffect追加
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { signInWithEmailAndPassword, User } from "firebase/auth";// User追加
import { collection, getDocs, query, where } from "firebase/firestore";
//import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../utils/firebase";//db追加
import { StudyData } from "../types/studyData";//追加

type UseFirebase = () => {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    user: User | null; // 追加、FirebaseSDKによるUser型またはNull
    setUser: React.Dispatch<React.SetStateAction<User | null>>;//追加
    learnings: StudyData[];//追加、StudyDataの型データによる配列
    setLearnings: React.Dispatch<React.SetStateAction<StudyData[]>>;//追加
    fetchDb: (data: string) => Promise<void>//追加
    calculateTotalTime: () => number//追加
    /*
    entryDb: (data: StudyData) => Promise<void>;
    updateDb: (data: StudyData) => Promise<void>;
    deleteDb: (data: StudyData) => Promise<void>;
    handleLogout: () => Promise<void>;
    */
}

export const useFirebase: UseFirebase = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null); // セッションユーザ情報のステート追加
    const [learnings, setLearnings] = useState<StudyData[]>([]);//学習記録データのステート追加
    const navigate = useNavigate()
    const toast = useToast()

    ////Authentication
    //ログイン処理
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userLogin = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logined:", userLogin);
            toast({
                title: 'ログインしました',
                position: 'top',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            navigate('/')
        }
        catch (error) {
            console.error("Error during sign up:", error);
            toast({
                title: 'ログインに失敗しました',
                description: `${error}`,
                position: 'top',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
        finally {
            setLoading(false);
        }
    };

    //追加、ユーザがセッション中か否かの判定処理
    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user) => {
            setUser(user); // userはnullかUserオブジェクト
            if (user) {
                setEmail(user.email as string)
            }
        });
        return () => {
            unsubscribed();
        };
    }, [user]);

    /*
      //ログアウト処理
        const handleLogout = async () => {
            setLoading(true);
            try {
                const usertLogout = await auth.signOut();
                console.log("User Logout:", usertLogout);
                toast({
                    title: 'ログアウトしました',
                    position: 'top',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                navigate('/login');
            }
            catch (error) {
                console.error("Error during logout:", error);
                toast({
                    title: 'ログアウトに失敗しました',
                    description: `${error}`,
                    position: 'top',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
            finally {
                setLoading(false);
            }
        }
    */

    ////Firestore 
    //Firestoreデータ取得
    const fetchDb = async (data: string) => {
        setLoading(true);
        try {
            const usersCollectionRef = collection(db, 'users_learnings');
            const q = query(usersCollectionRef, where('email', '==', data)); // ログインユーザーのemailでフィルタ
            const querySnapshot = await getDocs(q);
            const fetchedLearnings = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            } as StudyData));// Firebaseから取得したデータを`StudyData`型に明示的に変換
            setLearnings(fetchedLearnings); // 正しい型でセット
        }
        catch (error) {
            console.error("Error getting documents: ", error);
        }
        finally {
            setLoading(false);
        }
    }

    /*
  //Firestoreデータ新規登録
    const entryDb = async (data: StudyData) => {
        setLoading(true)
        try {
            const usersCollectionRef = collection(db, 'users_learnings');
            const documentRef = await addDoc(usersCollectionRef, {
                title: data.title,
                time: data.time,
                email: email
            });
            console.log(documentRef, data);
            toast({
                title: 'データ登録が完了しました',
                position: 'top',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        catch (error) {
            console.error("Error adding document: ", error);
            toast({
                title: 'データ登録に失敗しました',
                description: `${error}`,
                position: 'top',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
        finally {
            setLoading(false)
        }
    }

  //Firestoreデータ更新
    const updateDb = async (data: StudyData) => {
        setLoading(true)
        try {
            const userDocumentRef = doc(db, 'users_learnings', data.id);
            await updateDoc(userDocumentRef, {
                title: data.title,
                time: data.time
            });
            toast({
                title: 'データ更新が完了しました',
                position: 'top',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        catch (error) {
            console.log(error)
            toast({
                title: 'データ更新に失敗しました',
                description: `${error}`,
                position: 'top',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

  //Firestoreデータ削除
    const deleteDb = async (data: StudyData) => {
        setLoading(true);
        try {
            const userDocumentRef = doc(db, 'users_learnings', data.id);
            await deleteDoc(userDocumentRef);
            toast({
                title: 'データを削除しました',
                position: 'top',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        catch (error) {
            console.error("Error during delete:", error);
            toast({
                title: 'デー削除に失敗しました',
                description: `${error}`,
                position: 'top',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
        finally {
            setLoading(false);
        }
    }

  //Firestore確認
    useEffect(() => {
        if (email) {
            fetchDb(email)
            console.log('Firestore', email)
        }
    }, [email]);// userが更新された時のみ実行
*/
    ////Others
    //学習時間合計
    const calculateTotalTime = () => {
        return learnings.reduce((total, learning) => total + learning.time, 0);
    };

    return {
        loading,
        setLoading,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        user,//追加
        setUser,//追加
        learnings,//追加
        setLearnings,//追加
        fetchDb,//追加
        calculateTotalTime//追加
        /*
          ,
            user,
            entryDb,
            updateDb,
            deleteDb,
            handleLogout,

            */
    }
}