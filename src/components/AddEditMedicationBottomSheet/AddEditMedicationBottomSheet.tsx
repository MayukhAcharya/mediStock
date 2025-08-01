import { View, Text, Modal, StatusBar, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import { styles } from 'src/components/AddEditMedicationBottomSheet/styles';
import { colors } from 'src/config/colors';
import { commonStyles } from 'src/config/commonStyles';
import { database } from 'src/Database/database';
import normalize from 'src/config/normalize';
import Button from 'src/components/Button/Button';
import TimeComponent from 'src/components/TimeComponent/TimeComponent';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import { MedicationProfileStack } from 'src/navigation/types';
import { useNavigation } from '@react-navigation/native';

type navigationPropsForHealthProfile =
  NativeStackNavigationProp<MedicationProfileStack>;

type medicineData = {
  category: string;
  expiry_date: string;
  id: string;
  medicine_name: string;
  quantity: string;
  uses: string;
  label: string;
  value: string;
};

type medicationTypes = {
  medicineName: string;
  medicineId: string;
  medicationTime: any;
  category: string;
  id: string;
};

type addEditMedicationProps = {
  onClose: () => void;
  isVisible: boolean;
  medicineObject?: medicationTypes | any;
  allMedicineArray?: medicationTypes[];
  onSave: (data: medicationTypes) => void;
  onSaveArray: (data: medicationTypes[]) => void;
  id: string;
};

const AddEditMedicationBottomSheet = (props: addEditMedicationProps) => {
  const currentStyles = styles();
  const {
    isVisible = false,
    onClose,
    medicineObject,
    onSave,
    allMedicineArray,
    onSaveArray,
    id,
  } = props;
  const navigation = useNavigation<navigationPropsForHealthProfile>();

  const [allMedicines, setAllMedicines] = useState<medicineData[]>([]);
  const [filterData, setFilterData] = useState<medicineData[]>(allMedicines);
  const [medicineData, setMedicineData] = useState<medicationTypes>({
    category: medicineObject ? medicineObject.category : '',
    medicationTime: medicineObject
      ? medicineObject.medicationTime
      : new Date().toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
    medicineId: medicineObject ? medicineObject.medicineId : '',
    medicineName: medicineObject ? medicineObject.medicineName : '',
    id: medicineObject ? medicineObject.id : '',
  });
  const [searchString, setSearchString] = useState<string>('');

  const getMedicineDataMethod = () => {
    try {
      const medicineData = database.get('medicines');
      medicineData
        .query()
        .observe()
        .forEach(item => {
          let temp: any = [];
          item.forEach(data => {
            temp.push(data._raw);
          });
          const finalList = temp.map((item: any) => {
            return {
              ...item,
              label: item.medicine_name,
              value: item.id,
            };
          });
          setAllMedicines(finalList);
        });
    } catch (error) {
      setAllMedicines([]);
    }
  };

  const handleDisable = () => {
    if (medicineObject) {
      if (medicineObject.medicineId === medicineData.medicineId) {
        if (medicineObject.medicationTime === medicineData.medicationTime) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if (medicineData.medicineId === '') {
        return true;
      }
    }
    return false;
  };

  const handleSave = () => {
    if (medicineObject) {
      const updatedArray = allMedicineArray
        ? allMedicineArray?.map(item => {
            if (item.id === medicineData.id) {
              return {
                ...item,
                medicationTime: medicineData.medicationTime,
                medicineName: medicineData.medicineName,
                medicineId: medicineData.medicineId,
                category: medicineData.category,
              };
            } else {
              return {
                ...item,
              };
            }
          })
        : [];
      onSaveArray(updatedArray);
    } else {
      const addObject = {
        medicineName: medicineData.medicineName,
        medicineId: medicineData.medicineId,
        medicationTime: medicineData.medicationTime,
        category: medicineData.category,
        id: `${medicineData.medicineId}${new Date().getTime()}`,
      };

      onSave(addObject);
    }
  };

  const searchMethod = (searchString: string) => {
    const searchedData = allMedicines.filter(item =>
      item.medicine_name.toLowerCase().includes(searchString.toLowerCase()),
    );

    setFilterData(searchedData);
  };

  const manageListToDisplay = () => {
    if (searchString && filterData) {
      return filterData;
    } else {
      return allMedicines;
    }
  };

  useEffect(() => {
    getMedicineDataMethod();
  }, []);
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor={colors.backgroundTransparent}
        barStyle={'light-content'}
        translucent
      />
      <Pressable style={currentStyles.container}>
        <View style={currentStyles.subContainer}>
          <View style={commonStyles.aic}>
            <Text style={currentStyles.HeaderTextStyle}>
              {medicineObject ? 'Edit' : 'Add'} Medication
            </Text>
          </View>
          <View style={currentStyles.inputContainer}>
            <SearchDropdown
              label={`${medicineObject ? 'Edit' : 'Add'} Medicine`}
              list={manageListToDisplay()}
              allStyle={commonStyles.w100per}
              borderColor={colors.borderColor}
              selectedValue={medicineData.medicineName}
              placeholder="Calpol-650"
              onValueSelect={item => {
                setMedicineData(prev => ({
                  ...prev,
                  category: item.category,
                  medicineId: item.value,
                  medicineName: item.label,
                }));
                setSearchString('');
                setFilterData([]);
              }}
              dropdownMainStyle={{
                maxHeight: normalize(300, 'height'),
              }}
              style={{ backgroundColor: colors.pureWhite }}
              onChangeText={text => {
                searchMethod(text);
                setSearchString(text);
              }}
              onAddPress={() => {
                navigation.navigate('AddMedicineScreen', {
                  medicationData: {
                    isHealthProfile: true,
                    id: id,
                    allMedicineArray: allMedicineArray,
                  },
                });
                onClose();
              }}
              onClose={() => {
                setFilterData([]);
                setSearchString('');
              }}
            />
            <TimeComponent
              label="Medication Time"
              allStyle={commonStyles.w100per}
              borderColor={colors.borderColor}
              placeholder="Before Lunch"
              value={medicineData.medicationTime}
              onChange={time => {
                setMedicineData(prev => ({
                  ...prev,
                  medicationTime: time.toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }),
                }));
              }}
              style={{ backgroundColor: colors.pureWhite }}
            />
          </View>
          <View style={currentStyles.bottomContainerMargin}>
            <Button
              label="Save Medicine"
              mainStyle={commonStyles.w100per}
              onPress={() => {
                handleSave();
                onClose();
              }}
              disable={handleDisable()}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AddEditMedicationBottomSheet;
