#!/usr/bin/env python3
import argparse
import os
import json
import pandas as pd


def excel_to_nested_json(excel_path, output_dir="data"):
    """Converte a sheet 'data' do Excel em JSON estruturado com lógica de KP e práticas."""

    if not os.path.exists(excel_path):
        print(f"❌ Arquivo {excel_path} não encontrado.")
        return

    try:
        df = pd.read_excel(excel_path, sheet_name="data")
    except ValueError:
        print(f"❌ Sheet 'data' não encontrada no arquivo {excel_path}.")
        return

    nested = {}

    for _, row in df.iterrows():
        bib = row.get("BibTexKey", "")
        text = row.get("text-passage", "")
        code = row.get("code", "")
        practice_instance = str(row.get("practice-instance", "")).strip()
        kp = str(row.get("KP", "")).strip()
        level = str(row.get("level", "")).strip()
        dimension = str(row.get("dimension", "")).strip()

        if not dimension:
            continue  # ignora linhas sem dimensão

        if dimension not in nested:
            nested[dimension] = {}

        # Caso 1: Linha define uma nova KP
        if not practice_instance:
            if kp not in nested[dimension]:
                nested[dimension][kp] = {
                    "level": level,
                    "text": text,
                    "bibtexkey": bib,
                    "code": code,
                    "practice_instances": []
                }
            else:
                # Caso a KP já exista, atualiza metadados (se ainda não houver)
                nested[dimension][kp].update({
                    "level": nested[dimension][kp].get("level") or level,
                    "text": nested[dimension][kp].get("text") or text,
                    "bibtexkey": nested[dimension][kp].get("bibtexkey") or bib,
                    "code": nested[dimension][kp].get("code") or code
                })

        # Caso 2: Linha define uma prática associada a uma KP
        else:
            if kp not in nested[dimension]:
                # se a KP ainda não foi criada, inicializa vazia
                nested[dimension][kp] = {
                    "level": level,
                    "text": "",
                    "bibtexkey": "",
                    "code": "",
                    "practice_instances": []
                }

            nested[dimension][kp]["practice_instances"].append({
                "bibtexkey": bib,
                "text": text,
                "code": code,
                "practice_instance": practice_instance
            })

    # Cria diretório de saída e salva JSON
    os.makedirs(output_dir, exist_ok=True)
    json_path = os.path.join(output_dir, "data.json")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(nested, f, indent=4, ensure_ascii=False)

    print(f"✅ Arquivo JSON criado em: {json_path}")


def main():
    parser = argparse.ArgumentParser(description="MM4SLR CLI Tool")
    parser.add_argument(
        "-update",
        metavar="EXCEL",
        help="Converte a sheet 'data' do Excel em JSON estruturado",
        required=True,
    )
    args = parser.parse_args()
    excel_to_nested_json(args.update)


if __name__ == "__main__":
    main()
