// /src/components/SendReset.tsx
import { Box, Button, Card, CardBody, Flex, Heading, Input, InputGroup, InputLeftElement, Stack, Text } from "@chakra-ui/react";
import { FaUserCheck } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { useFirebase } from "../hooks/useFirebase";

const SendReset = () => {
    const { loading, email, setEmail, handleResetPassword } = useFirebase()

    return (
        <>
            <Flex alignItems='center' justify='center' p={5}>
                <Card px={5}>
                    <Heading size='md' textAlign='center' mt={4}>パスワードリセット申請</Heading>
                    <Text textAlign='center' fontSize='12px' color='gray'>入力したメールアドレス宛にパスワードリセットURLの案内をお送りします。</Text>
                    <CardBody w={{ base: 'xs', md: 'lg' }}>

                        <form onSubmit={handleResetPassword}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <FaUserCheck color='gray' />
                                </InputLeftElement>
                                <Input
                                    autoFocus
                                    type='email'
                                    placeholder='登録メールアドレスを入力'
                                    name='email'
                                    value={email}
                                    required
                                    mb={2}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </InputGroup>
                            <Box mt={4} mb={2} textAlign='center'>
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    loadingText='Loading'
                                    spinnerPlacement='start'
                                    colorScheme='green'
                                    mx={2}>
                                    <Stack mr={2}><RiMailSendLine /></Stack>リセット申請する</Button>
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
export default SendReset