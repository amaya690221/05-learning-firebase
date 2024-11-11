// /src/components/UpdatePassword.tsx
import { Box, Button, Card, CardBody, Flex, Heading, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { RiLockPasswordFill } from "react-icons/ri";
import { useFirebase } from "../hooks/useFirebase";

const UpdatePassword = () => {
    const { loading, password, setPassword, passwordConf, setPasswordConf, currentPassword, setCurrentPassword, handleUpdatePassword } = useFirebase()

    return (
        <>
            <Flex justifyContent='center' boxSize='fit-content' mx='auto' p={5}>
                <Card size={{ base: 'sm', md: 'lg' }} p={4}>
                    <Heading size='md' textAlign='center'>パスワード更新</Heading>
                    <CardBody>
                        <form onSubmit={handleUpdatePassword}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <RiLockPasswordFill color='gray' />
                                </InputLeftElement>
                                <Input
                                    type='password'
                                    placeholder='現在のパスワードを入力'
                                    name='currentPassword'
                                    value={currentPassword}
                                    required
                                    mb={2}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <RiLockPasswordFill color='gray' />
                                </InputLeftElement>
                                <Input
                                    type='password'
                                    placeholder='新パスワードを入力'
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
                                    placeholder='新パスワードを入力(確認)'
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
                                >パスワードを更新する</Button>
                                <Button
                                    colorScheme='gray'
                                    onClick={() => window.history.back()}
                                    mx={2}
                                >戻る</Button>
                            </Box>
                        </form>
                    </CardBody>
                </Card>
            </Flex>
        </>
    )
};
export default UpdatePassword