export const molecules = {
    simple: [
        {name: 'Methanol', smiles: 'CO'},
        {name: 'Ethanol', smiles: 'CCO'},
        {name: 'Acetic acid', smiles: 'CC(=O)O'},
        {name: 'Ethane', smiles: 'CC'},
        {name: 'Propane', smiles: 'CCC'},
        {name: 'Glycine', smiles: 'NCC(=O)O'},
    ],
    aromatic: [
        {name: 'Benzene', smiles: 'c1ccccc1'},
        {name: 'Toluene', smiles: 'Cc1ccccc1'},
        {name: 'Naphthalene', smiles: 'c1ccc2ccccc2c1'},
        {name: 'Anthracene', smiles: 'c1ccc2cc3ccccc3cc2c1'},
        {name: 'Phenol', smiles: 'Oc1ccccc1'},
        {name: 'Aniline', smiles: 'Nc1ccccc1'},
    ],
    heterocycles: [
        {name: 'Pyridine', smiles: 'c1ccncc1'},
        {name: 'Pyrimidine', smiles: 'c1ccnc(n1)'},
        {name: 'Indole', smiles: 'c1ccc2[nH]ccc2c1'},
        {name: 'Imidazole', smiles: 'c1cnc[nH]1'},
        {name: 'Furan', smiles: 'c1ccoc1'},
        {name: 'Thiophene', smiles: 'c1ccsc1'},
    ],
    drugs: [
        {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
        {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
        {name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'},
        {name: 'Nicotine', smiles: 'CN1CCC[C@H]1c2cccnc2'},
        {name: 'Penicillin G', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
        {name: 'Morphine', smiles: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@@H]1C5'},
        {name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(O)cc1'},
        {name: 'Dopamine', smiles: 'NCCc1ccc(O)c(O)c1'},
    ],
    complex: [
        {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
        {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
        {name: 'Testosterone', smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@@]34C)[C@@H]1CC[C@@H]2O'},
        {name: 'ATP', smiles: 'c1nc(c2c(n1)n(cn2)[C@@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N'},
        {name: 'Vancomycin aglycone', smiles: 'C[C@H]1[C@H](O)CC2=CC(=C(C(=C2)O)Oc2cc3cc(c2Cl)Oc2ccc(cc2Cl)[C@@H](O)[C@H](NC(=O)[C@@H](CC(=O)N)NC1=O)C(=O)N[C@H]1[C@H](O)c2ccc(c(c2)O[C@@H]2OC=3C(O)=CC=4CC(=C(O)C=4C=3[C@@H]2O)O)Oc1cc1ccc(O)c(c1)C(=O)O)O'},
    ],
    stereo: [
        {name: 'L-Alanine', smiles: 'N[C@@H](C)C(=O)O'},
        {name: 'D-Alanine', smiles: 'N[C@H](C)C(=O)O'},
        {name: 'L-Tryptophan', smiles: 'N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O'},
        {name: 'Thalidomide', smiles: 'O=C1CCC(N2C(=O)c3ccccc3C2=O)C(=O)N1'},
    ],
};

// Showcase molecules for the landing page
export const showcaseMolecules = [
    {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
    {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
    {name: 'Penicillin G', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
    {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
    {name: 'Nicotine', smiles: 'CN1CCC[C@H]1c2cccnc2'},
    {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
    {name: 'Dopamine', smiles: 'NCCc1ccc(O)c(O)c1'},
    {name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'},
    {name: 'Benzene', smiles: 'c1ccccc1'},
    {name: 'Naphthalene', smiles: 'c1ccc2ccccc2c1'},
    {name: 'Morphine', smiles: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@@H]1C5'},
    {name: 'Testosterone', smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@@]34C)[C@@H]1CC[C@@H]2O'},
];

// Playground presets organized by category
export const playgroundPresets = {
    Simple: [
        {name: 'Methanol', smiles: 'CO'},
        {name: 'Ethane', smiles: 'CC'},
        {name: 'Acetic acid', smiles: 'CC(=O)O'},
        {name: 'Water', smiles: 'O'},
    ],
    Rings: [
        {name: 'Benzene', smiles: 'c1ccccc1'},
        {name: 'Naphthalene', smiles: 'c1ccc2ccccc2c1'},
        {name: 'Cyclohexane', smiles: 'C1CCCCC1'},
        {name: 'Cyclopropane', smiles: 'C1CC1'},
    ],
    Drugs: [
        {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
        {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
        {name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'},
        {name: 'Penicillin G', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
    ],
    Complex: [
        {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
        {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
        {name: 'ATP', smiles: 'c1nc(c2c(n1)n(cn2)[C@@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N'},
    ],
    Stereo: [
        {name: 'L-Alanine', smiles: 'N[C@@H](C)C(=O)O'},
        {name: 'Nicotine', smiles: 'CN1CCC[C@H]1c2cccnc2'},
        {name: 'Thalidomide', smiles: 'O=C1CCC(N2C(=O)c3ccccc3C2=O)C(=O)N1'},
    ],
};
