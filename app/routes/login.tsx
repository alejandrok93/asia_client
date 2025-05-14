import { Form, useActionData, useNavigation } from '@remix-run/react';
import { useState } from 'react';
import { ActionFunctionArgs, json } from '@remix-run/node';
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Tabs,
  Text,
  Divider,
  Paper,
  Container,
  Title,
  Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { IconLock, IconAt, IconUser, IconId } from '@tabler/icons-react';
import { login, createUserSession, registerUser } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return json({ error: 'Invalid form submission' }, { status: 400 });
  }

  try {
    if (formData.get('loginType') === 'login') {
      const {token, user} = await login(email, password);
      return createUserSession(token, '/');
    }
    if (formData.get('loginType') === 'register') {
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const agentId = formData.get('agentId');
      const firmId = formData.get('firmId');

      if (!firstName || !lastName || !agentId || !firmId) {
        return json({ error: 'Invalid form submission' }, { status: 400 });
      }

      return registerUser({ first_name: firstName, last_name: lastName, email, password, password_confirmation: password, agent_id: agentId, role: 'agent', firm_id: parseInt(firmId) });

    }
  } catch (error) {
    console.log('error', error)
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  // Check if we're in a submitting state
  const isLoading = navigation.state === "submitting";

  // Login form
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  // Registration form
  const registerForm = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      agentId: '',
      firmId: '1', // Default firm ID
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
      passwordConfirmation: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      firstName: (value) => (value.length < 2 ? 'First name is too short' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is too short' : null),
      agentId: (value) => (value.length < 3 ? 'Agent ID is too short' : null),
    },
  });

  console.log('action data', actionData);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container size="xs">
        <div className="text-center mb-10">
          <Title order={1} className="text-primary-600">
            ASIA.ai
          </Title>
          <Text c="dimmed" mt="sm">
            Artificial Intelligence for Insurance Agents
          </Text>
        </div>

        <Paper radius="md" p="xl" withBorder className="bg-white shadow-lg">
          <Tabs value={activeTab} onChange={setActiveTab} radius="md">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="login" className="font-medium">
                Login
              </Tabs.Tab>
              <Tabs.Tab value="register" className="font-medium">
                Register
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login">
              <Form method="post">
                <input type="hidden" name="loginType" value="login" />

                {actionData?.error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
                    {actionData.error}
                  </div>
                )}

                <TextInput
                  required
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  leftSection={<IconAt size={16} />}
                  {...loginForm.getInputProps('email')}
                  mb="md"
                />

                <PasswordInput
                  required
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  leftSection={<IconLock size={16} />}
                  {...loginForm.getInputProps('password')}
                  mb="md"
                />

                <Group position="apart" mb="md">
                  <Anchor component="button" type="button" size="sm">
                    Forgot password?
                  </Anchor>
                </Group>

                <Button
                  fullWidth
                  type="submit"
                  loading={isLoading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Sign in
                </Button>
              </Form>
            </Tabs.Panel>

            <Tabs.Panel value="register">
              <Form method="post">
                <input type="hidden" name="loginType" value="register" />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    required
                    name="email"
                    label="First name"
                    placeholder="John"
                    leftSection={<IconUser size={16} />}
                    {...registerForm.getInputProps('firstName')}
                  />

                  <TextInput
                    required
                    label="Last name"
                    placeholder="Doe"
                    leftSection={<IconUser size={16} />}
                    {...registerForm.getInputProps('lastName')}
                  />
                </div>

                <TextInput
                  required
                  label="Email"
                  placeholder="you@example.com"
                  leftSection={<IconAt size={16} />}
                  mt="md"
                  {...registerForm.getInputProps('email')}
                />

                <TextInput
                  required
                  label="Agent ID"
                  placeholder="AGT123"
                  leftSection={<IconId size={16} />}
                  mt="md"
                  {...registerForm.getInputProps('agentId')}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Create a password"
                    leftSection={<IconLock size={16} />}
                    {...registerForm.getInputProps('password')}
                  />

                  <PasswordInput
                    required
                    label="Confirm password"
                    placeholder="Confirm password"
                    leftSection={<IconLock size={16} />}
                    {...registerForm.getInputProps('passwordConfirmation')}
                  />
                </div>

                <Button
                  fullWidth
                  type="submit"
                  mt="xl"
                  loading={isLoading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Create account
                </Button>
              </Form>
            </Tabs.Panel>
          </Tabs>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow>
            <Button variant="outline">Google</Button>
            <Button variant="outline">Microsoft</Button>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}
