// /src/components/Login.tsx

import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useFirebase } from "../hooks/useFirebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loading, email, setEmail, password, setPassword, handleLogin } =
    useFirebase();
  const navigate = useNavigate();

  return (
    <>
      <Flex justifyContent="center" boxSize="fit-content" mx="auto" p={5}>
        <Card size={{ base: "sm", md: "lg" }} p={4}>
          <Heading size="md" textAlign="center">
            ログイン
          </Heading>
          <CardBody>
            <form onSubmit={handleLogin}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaUserCheck color="gray" />
                </InputLeftElement>
                <Input
                  autoFocus
                  type="email"
                  placeholder="メールアドレスを入力"
                  name="email"
                  value={email}
                  mb={2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <RiLockPasswordFill color="gray" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="パスワードを入力"
                  name="password"
                  value={password}
                  required
                  mb={2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </InputGroup>
              <Box mt={4} mb={2} textAlign="center">
                <Button
                  isLoading={loading}
                  loadingText="Loading"
                  spinnerPlacement="start"
                  type="submit"
                  colorScheme="green"
                  width="100%"
                  mb={2}
                >
                  ログイン
                </Button>
                <Button
                  colorScheme="green"
                  width="100%"
                  variant="outline"
                  onClick={() => navigate("/register")}
                >
                  新規登録
                </Button>
              </Box>
              <Box mt={4} mb={2} textAlign="center">
                <Stack spacing={3}>
                  <Button
                    colorScheme="green"
                    width="100%"
                    variant="ghost"
                    onClick={() => navigate("/sendReset")} //変更：クリックしたら、/sendRestに遷移
                  >
                    パスワードをお忘れですか？
                  </Button>
                </Stack>
              </Box>
            </form>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
};
export default Login;
