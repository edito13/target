import Button from "@/components/Button";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StatusBar, Text, View } from "react-native";
import CurrencyInput from "@/components/CurrencyInput";
import useTargetDatabase from "@/database/useTargetDatabase";
import useNotification from "@/hooks/useNotifications";

interface TargetProps {}

const Target: React.FC<TargetProps> = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleNotificate } = useNotification();

  const params = useLocalSearchParams<{ id?: string }>();

  const targetDatabase = useTargetDatabase();

  const handleSave = () => {
    if (!name.trim() || amount <= 0) {
      return Alert.alert(
        "Atenção",
        "Preencha nome e o valor precisa ser maior que zero."
      );
    }

    setIsProcessing(true);

    if (params.id) {
      // update target
      handleUpdate(Number(params.id));
    } else {
      // create target
      handleCreate();
    }
  };

  const handleCreate = async () => {
    const payload = { name, amount };
    try {
      await targetDatabase.create(payload);
      await handleNotificate({
        title: "Nova meta",
        message: "Meta criada com sucesso!",
      });

      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta.");
      console.log(error);
      setIsProcessing(false);
    }
  };

  const fetchDetails = async (id: number) => {
    try {
      const response = await targetDatabase.show(id);
      setName(response.name);
      setAmount(response.amount);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da meta");
      console.log(error);
    }
  };

  const handleUpdate = async (id: number) => {
    const payload = { name, amount, id };
    try {
      setIsProcessing(true);
      await targetDatabase.update(payload);

      await handleNotificate({
        title: "Atualização da Meta",
        message: "Meta atualizada com sucesso!",
      });

      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível editar a meta.");
      console.log(error);
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    if (!params.id) return;

    Alert.alert("Deletar Meta", "Tem certeza que deseja deletar esta meta?", [
      {
        text: "Não",
        style: "cancel",
      },
      { text: "Sim", onPress: () => handleDelete(Number(params.id)) },
    ]);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsProcessing(true);
      await targetDatabase.remove(id);
      await handleNotificate({
        title: "Exluir Meta",
        message: "Meta deletada com sucesso!",
      });

      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a meta.");
      console.log(error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchDetails(Number(params.id));
  }, [params.id]);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <StatusBar barStyle="dark-content" />
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
        rightButton={
          params.id
            ? { icon: "delete", onPress: () => handleRemove() }
            : undefined
        }
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          value={name}
          label="Nova meta"
          onChangeText={setName}
          placeholder="Ex: Viagem para praia, Apple Watch"
        />
        <CurrencyInput
          value={amount}
          label="Valor alvo (R$)"
          onChangeValue={setAmount}
        />
        <Button
          title="Salvar"
          onPress={handleSave}
          isProcessing={isProcessing}
        />
      </View>
    </View>
  );
};

export default Target;
