// /src/components/Register.tsx
import { Box, Button, Card, CardBody, Flex, Heading, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useFirebase } from "../hooks/useFirebase";

const Register = () => {
    const { loading, email, setEmail, password, setPassword, passwordConf, setPasswordConf, handleSignup } = useFirebase()

    return (
        <>
            <Flex justifyContent='center' boxSize='fit-content' mx='auto' p={5}>
                <Card size={{ base: 'sm', md: 'lg' }} p={4}>
                    <Heading size='md' textAlign='center'>ユーザ登録</Heading>
                    <CardBody>
                        <form onSubmit={handleSignup}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <FaUserCheck color='gray' />
                                </InputLeftElement>
                                <Input
                                    autoFocus
                                    type='email'
                                    placeholder='メールアドレスを入力'
                                    name='email'
                                    value={email}
                                    required
                                    mb={2}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </InputGroup>
                            <Text fontSize='12px' color='gray'>パスワードは6文字以上</Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <RiLockPasswordFill color='gray' />
                                </InputLeftElement>
                                <Input
                                    type='password'
                                    placeholder='パスワードを入力'
                                    name='password'
                                    value={password}
                                    required
                                    mb={2}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <RiLockPasswordFill color='gray' />
                                </InputLeftElement>
                                <Input
                                    type='password'
                                    placeholder='パスワードを入力(確認)'
                                    name='passwordConf'
                                    value={passwordConf}
                                    required
                                    mb={2}
                                    onChange={e => setPasswordConf(e.target.value)}
                                />
                            </InputGroup>
                            <Box mt={4} mb={2} textAlign='center'>
                                <Button
                                    isLoading={loading}
                                    loadingText='Loading'
                                    spinnerPlacement='start'
                                    type='submit'
                                    colorScheme='green'
                                    width='100%'
                                    mb={2}>登録する</Button>
                                <Button
                                    colorScheme='gray'
                                    onClick={() => window.history.back()}
                                    width='100%'>戻る</Button>
                            </Box>
                        </form>
                    </CardBody>
                </Card>
            </Flex>
        </>
    )
};
export default Register;