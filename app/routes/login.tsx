import { useState } from 'react';
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
import { IconLock, IconAt, IconUser, IconId, IconBuildingSkyscraper } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLoginSubmit = async (values: typeof loginForm.values) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      console.log('Login values:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success notification
      notifications.show({
        title: 'Login successful',
        message: 'Welcome to ASIA.ai platform',
        color: 'green',
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      notifications.show({
        title: 'Login failed',
        message: 'Please check your credentials and try again',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (values: typeof registerForm.values) => {
    setIsLoading(true);
    try {
      // This would be replaced with actual API call
      console.log('Register values:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success notification
      notifications.show({
        title: 'Registration successful',
        message: 'Your account has been created. You can now log in.',
        color: 'green',
      });

      // Switch to login tab
      setActiveTab('login');
    } catch (error) {
      console.error('Registration error:', error);
      notifications.show({
        title: 'Registration failed',
        message: 'Please check your information and try again',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <form onSubmit={loginForm.onSubmit(handleLoginSubmit)}>
                <TextInput
                  required
                  label="Email"
                  placeholder="you@example.com"
                  leftSection={<IconAt size={16} />}
                  {...loginForm.getInputProps('email')}
                  mb="md"
                />

                <PasswordInput
                  required
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
              </form>
            </Tabs.Panel>

            <Tabs.Panel value="register">
              <form onSubmit={registerForm.onSubmit(handleRegisterSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    required
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
              </form>
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
