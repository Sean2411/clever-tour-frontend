import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Icon
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaGlobe } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const LanguageSwitcher = ({ size = 'sm', variant = 'ghost' }) => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        size={size}
        variant={variant}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<Icon as={FaGlobe} />}
        _hover={{ bg: 'gray.100' }}
        _active={{ bg: 'gray.200' }}
      >
        <HStack spacing={1}>
          <Text fontSize="sm">{currentLanguage.flag}</Text>
          <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
            {currentLanguage.name}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            bg={i18n.language === language.code ? 'blue.50' : 'transparent'}
            _hover={{ bg: 'blue.50' }}
          >
            <HStack spacing={2}>
              <Text fontSize="lg">{language.flag}</Text>
              <Text>{language.name}</Text>
              {i18n.language === language.code && (
                <Text fontSize="sm" color="blue.500" ml="auto">
                  ✓
                </Text>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
