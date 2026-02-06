import { Button, ErrorView, Spinner } from 'heroui-native'
import { Ionicons } from '@expo/vector-icons'
import { Link, Redirect } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TextInput } from '@/components'
import { authClient } from '@/lib/auth-client'

const RESET_DEEP_LINK = 'burn-app://reset-password'

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets()
  const { data: session, isPending } = authClient.useSession()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  if (isPending) {
    return null
  }

  if (session?.user) {
    return <Redirect href='/(tabs)' />
  }

  async function handleSendResetLink() {
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    setIsLoading(true)
    setError(null)

    const { error: err } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: RESET_DEEP_LINK,
    })

    setIsLoading(false)
    if (err) {
      setError(err.message || 'Failed to send reset link')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <ScrollView
        className='flex-1 bg-app-bg'
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
          minHeight: '100%',
          justifyContent: 'center',
        }}
      >
        <View className='items-center mb-8'>
          <View className='w-24 h-24 rounded-full bg-pastel-purple items-center justify-center'>
            <Ionicons name='mail-open-outline' size={48} color='#FFFFFF' />
          </View>
        </View>
        <View
          className='bg-card rounded-lg p-6'
          style={{
            shadowColor: 'rgba(1, 4, 9, 0.12)',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 1,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text className='text-ink text-2xl font-bold mb-2'>Check your email</Text>
          <Text className='text-muted text-sm mb-6'>
            If an account exists for that email, we've sent a link to reset your password.
          </Text>
          <Link href='/(auth)/login' asChild>
            <TouchableOpacity>
              <Text className='text-accent font-medium text-sm text-center'>Back to sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      className='flex-1 bg-app-bg'
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 24,
        minHeight: '100%',
        justifyContent: 'center',
      }}
    >
      <View className='items-center mb-8'>
        <View className='w-24 h-24 rounded-full bg-pastel-purple items-center justify-center'>
          <Ionicons name='key-outline' size={48} color='#FFFFFF' />
        </View>
      </View>
      <View
        className='bg-card rounded-lg p-6'
        style={{
          shadowColor: 'rgba(1, 4, 9, 0.12)',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 1,
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <Text className='text-ink text-2xl font-bold mb-2'>Forgot password</Text>
        <Text className='text-muted text-sm mb-6'>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        <ErrorView isInvalid={!!error} className='mb-4'>
          {error}
        </ErrorView>

        <View className='gap-4'>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='Email'
            icon='mail-outline'
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
          />

          <Button onPress={handleSendResetLink} isDisabled={isLoading} className='rounded-full h-11 bg-accent mt-2'>
            {isLoading ? (
              <Spinner size='sm' color='default' />
            ) : (
              <Button.Label className='text-white font-medium'>Send reset link</Button.Label>
            )}
          </Button>

          <View className='flex-row justify-center items-center mt-4'>
            <Link href='/(auth)/login' asChild>
              <TouchableOpacity>
                <Text className='text-accent font-medium text-sm'>Back to sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
