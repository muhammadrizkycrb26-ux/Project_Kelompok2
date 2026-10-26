import { StyleSheet, View } from "react-native";

import { ServiceOption } from "@/components/molecules";
import type { Service } from "@/data/services";

type ServicePickerProps = {
  services: Service[];
  selectedId: string;
  onSelect: (service: Service) => void;
};

export function ServicePicker({ services, selectedId, onSelect }: ServicePickerProps) {
  return (
    <View style={styles.list}>
      {services.map((service) => (
        <ServiceOption
          key={service.id}
          service={service}
          active={service.id === selectedId}
          onPress={() => onSelect(service)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 18, gap: 10 },
});
