'use client'

import { Redirect, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { authClient } from '@/lib/auth-client'

const AcceptInvitationScreen = () => {
  const { invitationId } = useLocalSearchParams<{ invitationId?: string }>()
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (sessionPending || !invitationId) return
    if (!session?.user) return
    if (status !== 'idle') return

    setStatus('loading')
    authClient.organization
      .acceptInvitation({ invitationId })
      .then(async (res) => {
        if (res.error) {
          setStatus('error')
          return
        }
        const data = res.data as { organizationId?: string; organization?: { id: string } } | undefined
        const organizationId = data?.organizationId ?? data?.organization?.id
        if (organizationId) {
          const setActive = (
            authClient.organization as {
              setActiveOrganization?: (p: { organizationId: string }) => Promise<unknown>
            }
          ).setActiveOrganization
          if (setActive) await setActive({ organizationId })
        }
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [session, sessionPending, invitationId, status])

  if (!invitationId) {
    return <Redirect href="/(tabs)" />
  }

  if (!sessionPending && !session?.user) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/login',
          params: { invitationId },
        }}
      />
    )
  }

  if (status === 'done') {
    return <Redirect href="/(tabs)" />
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <ActivityIndicator size="large" color="#FD6E20" />
        <Text className="mt-4 text-app-fg">Joining organization…</Text>
      </View>
    )
  }

  return <Redirect href="/(tabs)" />
}

export default AcceptInvitationScreen
