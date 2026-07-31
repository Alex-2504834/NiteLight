/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockUnsubscribe = jest.fn();
const mockHideBootSplash = jest.fn(() => Promise.resolve());

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onAuthStateChanged: jest.fn(callback => {
      callback(null);
      return mockUnsubscribe;
    }),
  })),
}));

jest.mock('react-native-bootsplash', () => ({
  __esModule: true,
  default: {
    hide: mockHideBootSplash,
  },
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/navigation/TabNavigator', () => {
  const {Text} = require('react-native');
  return () => <Text>Tabs</Text>;
});

jest.mock('../src/screens/InitialScreen', () => {
  const {Text} = require('react-native');
  return () => <Text>Initial screen</Text>;
});

import App from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the signed-out route and hides the splash screen', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    expect(renderer!.root.findByProps({children: 'Initial screen'})).toBeTruthy();
    expect(mockHideBootSplash).toHaveBeenCalledWith({fade: true});

    await ReactTestRenderer.act(async () => {
      renderer!.unmount();
    });

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
